import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {ManageHive} from './components/screens/Manage'
import {HiveGraph} from './components/screens/Graph'
import {HiveStatusScreen} from './components/screens/Status'
import {AddHiveScreen} from './components/screens/AddHive'
import {HiveHomeScreen} from './components/screens/Home'
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AppLoadingPlaceholder from "expo/build/launch/AppLoadingPlaceholder";
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import {RetriveHiveData} from "./components/screens/RetrieveHiveDataScreen";

const Stack = createStackNavigator();
export default function App() {

    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        Font.loadAsync({
            Roboto: require('native-base/Fonts/Roboto.ttf'),
            Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
            ...Ionicons.font,
        }).then(() => setLoading(false));
        setLoading(false)
        /*zeroconf.on('start',()=>{setLoading(true)});
        zeroconf.on('stop',()=>{setLoading(false)});
        zeroconf.on('resolve', service=>{
            setData({...data, [service.host]:service,})*/

    }, []);
    return (
        isLoading ? <AppLoadingPlaceholder/> : (

                <NavigationContainer>
                    <Stack.Navigator screenOptions={{
                        headerShown: false
                    }}>

                        <Stack.Screen name="home" component={HiveHomeScreen}/>
                        <Stack.Screen name="status" component={HiveStatusScreen}/>
                        <Stack.Screen name="graph" component={HiveGraph}/>
                        <Stack.Screen name="add_hive" component={AddHiveScreen}/>
                        <Stack.Screen name="manage_hive" component={ManageHive}/>
                        <Stack.Screen name="retrive_hive_data" component={RetriveHiveData}/>

                    </Stack.Navigator>
                </NavigationContainer>
        )
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
