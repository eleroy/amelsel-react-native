import {Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title, View} from "native-base";
import React, {useState} from "react";
import {HiveManager} from "../HiveManager";

import {ActivityIndicator, StyleSheet} from "react-native";

export function ManageHive({navigation}) {
    const [loading, setLoading] = useState(false)
    const hiveManager = new HiveManager()
    return (
        <Container>
            <Header>
                <Left>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                </Left>
                <Body>
                    <Title>Manage hive</Title>
                </Body>
                <Right/>
            </Header>
            <Content>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    margin: 10
                }}>
                    <Text style={styles.smallTitle}>RTC Setup</Text>
                    <Button onPress={() => {setLoading(true); hiveManager.setRTC().then(()=>setLoading(false));}}><Text>Set RTC</Text></Button>
                    <Button onPress={() => {
                        hiveManager.getRTC().then((rtc) => alert(rtc))
                    }}><Text>Get RTC</Text></Button>
                </View>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    margin: 10
                }}>
                    <Text style={styles.smallTitle}>Data management</Text>
                    <Button onPress={() => {setLoading(true); hiveManager.clearHiveData().then(()=>setLoading(false))}}><Text>Clear data</Text></Button>
                    <Button onPress={() => navigation.navigate("retrive_hive_data")}><Text>Retrive missing
                        data</Text></Button>
                </View>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    margin: 10
                }}>
                    <Text style={styles.smallTitle}>Data management</Text>
                    <Button onPress={() => {setLoading(true); hiveManager.clearAsyncStorage().then(()=>setLoading(false))}}><Text>Clear local data</Text></Button>
                </View>
                {
                    loading && (
                    <View style={styles.loading}>
                    <ActivityIndicator/>
                    </View>)
                }
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    smallTitle: {
        fontWeight: 'bold'
    },
    innerText: {
        color: 'red'
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
