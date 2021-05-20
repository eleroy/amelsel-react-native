import {VictoryLabel, VictoryPie} from "victory-native";
import React, {useEffect, useState} from "react";
import {Container, Content, View, Text} from "native-base";
import {HiveManager} from "../HiveManager";
import * as ScreenOrientation from 'expo-screen-orientation';
import {Dimensions, StyleSheet} from "react-native";
const screenDimensions = Dimensions.get('screen')
export function RetriveHiveData({navigation}) {
    const getData = (percent) => [{x: 1, y: percent}, {x: 2, y: 100 - percent}];
    const [data, setData] = useState(getData(0))
    const [percent, setPercent] = useState(0)
    const [consoleMessage, setConsoleMessage] = useState("")
    const hiveManager = new HiveManager();
    const loadfiles = async () => {
        await hiveManager.loadHiveData()
        setConsoleMessage("Getting missing data")
        let missingData = await hiveManager.getMissingData()
        setConsoleMessage(missingData.names.length+" data files to be updated")
        setPercent(10);
        setData(getData(10));
        let increment = (100 - 11) / (missingData.names.length)
        for (const [index, item] of missingData.names.entries()) {
            setConsoleMessage("Getting "+item+"...")
            let index_file = hiveManager.read_file_list.names.indexOf(item);
            let file_data = await hiveManager.getDataFileText(item).then((response)=>response.text())
            setConsoleMessage("Getting "+item+"...Done")
            // const total = Number(file_data.headers.get('content-length'));
            // const reader = await file_data.body.getReader()
            //
            // let byteReceived = 0;
            // let final_data = ""
            //
            //
            // while (true)
            // {
            //     const result = await reader.read()
            //     if (result.done){
            //         break
            //     }
            //     byteReceived += result.value.length
            //     final_data+= utf8.decode(result.value)
            //     //console.log(result.value)
            //     console.log(byteReceived/total*100)
            //     setPercent(byteReceived/total*100)
            //     setData(getData(byteReceived/total*100))
            //
            // }
            file_data = hiveManager.convertCsvToData(file_data)

            if (index_file > -1) {
                hiveManager.read_file_list.data[index_file] = file_data;
                hiveManager.read_file_list.sizes[index_file] = missingData.sizes[index]
            } else {
                hiveManager.read_file_list.data.push(file_data)
                hiveManager.read_file_list.names.push(item)
                hiveManager.read_file_list.sizes.push(missingData.sizes[index])
            }
            setPercent(10 + (index + 1) * increment);
            console.log(percent)
            setData(getData(10 + (index + 1) * increment));
        }
        setConsoleMessage("Saving data to memory.")
        await hiveManager.saveHiveData()
    }

    useEffect(() => {
        loadfiles().then(() => { setConsoleMessage("Finished"); setTimeout(navigation.goBack, 1000)})
    }, [])
    return (
        <Container>
            <View style = {{flex: 1, flexDirection:"column", justifyContent:"space-around"}}>
                <View style = {{flex: 2, flexDirection:"row", justifyContent:"center"}}>
                <VictoryPie
                    standalone={true}
                    width={screenDimensions.width*0.8} height={screenDimensions.width*0.8}
                    animate={{ duration: 200 }}
                    data={data}
                    innerRadius={screenDimensions.width*0.25}
                    cornerRadius={25}
                    labels={() => null}
                    style={{
                        data: {
                            fill: ({datum}) => {
                                const color = datum.y > 30 ? "green" : "red";
                                return datum.x === 1 ? color : "transparent";
                            }
                        }
                    }}
                />
                </View>
                <View style = {{flex: 1, flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                <Text style={styles.smallTitle}>{Math.round(percent)} %</Text>
                    <Text style={styles.smallTitle}>{consoleMessage}</Text>
                </View>

                <View style = {{flex: 2, flexDirection:"row", justifyContent:"center"}}>
                </View>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    smallTitle: {
        fontWeight: 'bold',
        fontSize:20,
        textAlign:"center"
    }
});

