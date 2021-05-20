import React, {useEffect, useState} from "react";
import {parse} from "papaparse";
import {
    Body,
    Button,
    Container,
    Content,
    Header,
    Icon,
    Left,
    List,
    ListItem,
    Right,
    Spinner,
    Text,
    Title,
    View
} from "native-base";
import {Dimensions, RefreshControl, StyleSheet} from "react-native";
import {VictoryAxis, VictoryChart, VictoryLabel, VictoryLine, VictoryTheme, VictoryZoomContainer} from "victory-native";
import {hiveIp, HiveManager} from "../HiveManager";
import * as ScreenOrientation from 'expo-screen-orientation';


function DefaultGraph(props) {
    const [screenDimension, setScreenDimension] = useState(Dimensions.get('screen'))
    ScreenOrientation.addOrientationChangeListener(()=>{setScreenDimension(Dimensions.get('screen'))})

    return (
        <ListItem>
            <View style={{flex: 1}}>
                <Text>{props.y_data_label}</Text>
                <VictoryChart theme={VictoryTheme.material} height={200}
                              width={screenDimension.width*0.9} scale={{x: "time"}} containerComponent={
                    <VictoryZoomContainer zoomDimension="x" disable={false}/>
                }>
                    <VictoryLine data={props.data} x="date" y={props.y_data} animate={{
                        duration: 2000,
                        onLoad: {duration: 1000}
                    }} style={{
                        data: {stroke: "#c43a31", strokeWidth: 0.2},
                        parent: {border: "1px solid #ccc"}
                    }}
                    />
                    <VictoryAxis
                        label="Time"
                        axisLabelComponent={<VictoryLabel dy={20}/>}
                        theme={VictoryTheme.material}
                        tickFormat={(x) => new Date(x).getDate() + "/" + (new Date(x).getMonth() + 1) + "/" + new Date(x).getFullYear() + "\n" + new Date(x).getHours() + ':' + new Date(x).getMinutes()}
                        style={{
                            axis: {stroke: "#756f6a"},
                            axisLabel: {fontSize: 12},
                            grid: {stroke: "grey"},
                            ticks: {stroke: "grey", size: 5},
                            tickLabels: {fontSize: 8, padding: 5}
                        }}
                        fixLabelOverlap ={true}
                    />
                    <VictoryAxis dependentAxis
                                 label={props.y_data_label}
                                 axisLabelComponent={<VictoryLabel dy={-25}
                                 />}
                                 theme={VictoryTheme.material}
                                 style={{
                                     axis: {stroke: "#756f6a"},
                                     axisLabel: {fontSize: 12},
                                     grid: {stroke: "grey"},
                                     ticks: {stroke: "grey", size: 5},
                                     tickLabels: {fontSize: 8, padding: 5}
                                 }}

                    />
                </VictoryChart>
            </View>
        </ListItem>

    )
}

export function HiveGraph({navigation}) {
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    let hiveManager = new HiveManager()
    const onRefresh = React.useCallback(() => {
        setLoading(true)
        hiveManager.loadHiveData().then(()=> {setData(hiveManager.full_data);setLoading(false)})
    }, [])
    useEffect(() => {
        onRefresh()
    }, []);

    return (
        <Container>
            <Header>
                <Left>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                </Left>
                <Body>
                    <Title>Graph</Title>
                </Body>
                <Right/>
            </Header>
            <Content>

                {isLoading ? <Spinner color='blue'/> : (
                    <List>
                        <DefaultGraph data={data} y_data="dummy_1" y_data_label="Dummy 1" />
                        <DefaultGraph data={data} y_data="dummy_2" y_data_label="Dummy 2"/>
                    </List>
                )}

            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    graphView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5fcff"
    }

});
