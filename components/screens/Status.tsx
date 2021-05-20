import React, {useEffect, useState} from "react";
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
    Title
} from "native-base";
import {RefreshControl} from "react-native";
import {HiveManager} from "../HiveManager";

export function HiveStatusScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const hiveManager = new HiveManager();
    useEffect(() => {
        hiveManager.getHiveStatus().then((jsondata) => {
            //console.log(jsondata)
            let reformat_data = {
                ...jsondata.hive_settings,
                "memory_usage": jsondata.memory_usage
            };
            setData(reformat_data);
            setLoading(false)
        }).catch((error) => console.log(error));
    }, []);

    const onRefresh = React.useCallback(() => {
        hiveManager.getHiveStatus().then((jsondata) => {
            console.log(jsondata)
            let reformat_data = {
                ...jsondata.hive_settings,
                "memory_usage": jsondata.memory_usage
            };
            setData(reformat_data);
            setLoading(false)
        }).catch((error) => console.log(error));
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
                    <Title>Status</Title>
                </Body>
                <Right/>
            </Header>
            <Content refreshControl={<RefreshControl
                refreshing={isLoading}
                onRefresh={onRefresh}
            />}>
                {isLoading ? <Spinner color='blue'/> : (
                    <List>
                        <ListItem itemDivider>
                            <Text>Status</Text>
                        </ListItem>
                        {Object.keys(data).map((key, index) => {
                                if (['memory_usage'].includes(key) || true) {
                                    return (
                                        <ListItem key={key}>
                                            <Body>
                                                <Text>{key}</Text>
                                                <Text note>{JSON.stringify(data[key])}</Text>
                                            </Body>
                                        </ListItem>);
                                } else {
                                    return false;
                                }
                            }
                        )
                        }

                    </List>
                )}

            </Content>

        </Container>
    );
}
