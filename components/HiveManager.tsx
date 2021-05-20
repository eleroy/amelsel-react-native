import React from "react";
import {parse} from "papaparse";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const hiveIp = "192.168.43.75";
//export const hiveIp = "192.168.1.89";

export class HiveManager {
    name: string;
    base_address: string
    read_file_list: object
    full_data : []

    constructor() {
        this.name = "amelsel-1"
        this.base_address = "http://" + hiveIp + ":8081"
        this.read_file_list = {names:[],sizes:[],data:[]};
        this.full_data = []
        this.loadHiveData();
        //this.loadHiveData().then(() => this.getHiveData());
    }

    async loadHiveData(){
        try {
            const getvalue = await AsyncStorage.getItem('@'+this.name+'_data')
            this.read_file_list = (getvalue != null) ? JSON.parse(getvalue) : {names:[],sizes:[],data:[]};
        } catch (e) {
            this.read_file_list = {names:[],sizes:[],data:[]};
            // error reading value
        }
        for (const d of this.read_file_list.data) {
            this.full_data = this.full_data.concat(d)
        }
        this.full_data.sort(function(a, b) {
            var keyA = new Date(a.date),
                keyB = new Date(b.date);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });
    }
    async saveHiveData(){
        try {
            const jsonValue = JSON.stringify(this.read_file_list)
            //console.log(jsonValue)
            await AsyncStorage.setItem('@'+this.name+'_data', jsonValue)
        } catch (e) {
            // saving error
        }
    }

    async clearAsyncStorage() {
        AsyncStorage.clear();
    }

    async getRTC() {
        let endpoint = "/rtc"
        let rtc_value = await fetch(this.base_address + endpoint).then((response) => response.json()).then((json) => json["time"]).catch((error) => alert("Impossible to access hive"))
        return rtc_value
    }

    async setRTC() {
        console.log(JSON.stringify({time: Date.now()}))
        return await fetch("http://" + hiveIp + ":8081/rtc", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            body: "time=" + Math.floor(Date.now() / 1000)
        }).then((response) => response.json()).then((json) => console.log(json))
    }

    async clearHiveData() {
        let endpoint = "/sensors/clear"
        return await fetch(this.base_address + endpoint).then((response) => response.json()).then((json) => console.log(json.message)).catch((error) => alert("Impossible to access hive"))
    }

    async getHiveStatus() {
        let adress = "http://" + hiveIp + ":8081/system/status"
        let a = await fetch(adress)
            .then((response) => response.json())
            .then((json) => {
                //console.log(json);
                this.name = json.hive_settings.name;
                //console.log(this.name);
                return json;
            })
            .catch((error) => console.log(error));
        return a;
    }
    async getMissingData(): Promise<{ names: string[]; sizes: number[]; }>{
        let {names: read_file_names, sizes: read_file_size} = this.read_file_list;
        let file_list = await fetch("http://" + hiveIp + ":8081/sensors/list").then((response) => response.json()).then((json) => {
            return json
        })
        let missing_files: { names: string[]; sizes: number[] };
        missing_files = {names: [], sizes: []};
        file_list.files.forEach(async function (item:string, index:number) {
                if (read_file_names.includes(item)) {
                    console.log("File "+item+" already there...")
                    let index_file = read_file_names.indexOf(item)
                    if (read_file_size[index_file] != file_list.sizes[index]) {
                        console.log("Size of "+item+" is different fetching...")
                        missing_files.names.push(item)
                        missing_files.sizes.push(file_list.sizes[index])
                    }else{
                        console.log("Size of "+item+" is same, skipping...")
                    }
                }else{
                    console.log("File of "+item+" not there fetching...")
                    missing_files.names.push(item)
                    missing_files.sizes.push(file_list.sizes[index])
                }
            },this
        )
        return missing_files
    }

    async getHiveData() {
        let missingData = await this.getMissingData()
        for (const [index, item] of missingData.names.entries()){
                console.log(item)
                console.log(index)
                let index_file = this.read_file_list.names.indexOf(item);
                if (index_file>-1){
                    this.read_file_list.data[index_file] = await this.getDataFile(item);
                    this.read_file_list.sizes[index_file] = missingData.sizes[index]
                }else{
                    this.read_file_list.data.push(await this.getDataFile(item))
                    this.read_file_list.names.push(item)
                    this.read_file_list.sizes.push(missingData.sizes[index])
                }
            }
        await this.saveHiveData()
    }

    convertCsvToData(csv:string){
        let p = parse(csv, {header: true, dynamicTyping: true, skipEmptyLines: true})
        let data_csv = p.data
        data_csv = data_csv.map((d) => {
            d.date = new Date(d.date * 1000);
            return d
        })
        return data_csv;
    }
    getDataFileText(file:string){
        return fetch("http://" + hiveIp + ":8081/files/" + file)
    }
    async getDataFile(file: string){
        let data = await fetch("http://" + hiveIp + ":8081/files/" + file).then((response) => response.text()).then((text) => {
            let p = parse(text, {header: true, dynamicTyping: true, skipEmptyLines: true})
            let data_csv = p.data
            data_csv = data_csv.map((d) => {
                d.date = new Date(d.date * 1000);
                return d
            })
            return data_csv;
        })
        //console.log(JSON.stringify(data))
        return data
    }

    async constructData(){
        let read_file_list = {names:[],sizes:[],data:[]}
        try {
            const getvalue = await AsyncStorage.getItem('@read_files')
            read_file_list = (getvalue != null) ? JSON.parse(getvalue) : {names:[],sizes:[],data:[]};
        } catch (e) {
            read_file_list = {names:[],sizes:[],data:[]};
            // error reading value
        }
    }
}

