import {StyleSheet} from "react-native";
import React, {useState} from "react";
import {Content, Button, Container, Header,Left,Right,Body, List,ListItem, Text, Title, View} from "native-base";

export function HiveHomeScreen({navigation}) {
    const [active, setActive] = useState(false);

    return (
        <Container>
            <Header noLeft>
                <Body>
                    <Title>Amelsel</Title>
                </Body>
                <Right>
                    <Button transparent onPress={() => navigation.navigate("add_hive")}>
                        <Text>Add Hive</Text>
                    </Button>
                </Right>
            </Header>
            <View style={{flex: 1}}>
                <List>
                    <ListItem>
                            <View style={{flex:1,flexDirection: 'row', justifyContent: 'space-between',alignItems:'center'}}>
                                <Text style={styles.smallTitle}>Amelsel-1</Text>
                                <Button onPress={() => navigation.navigate("status")}>
                                    <Text>Status</Text>
                                </Button>
                                <Button
                                    onPress={() => navigation.navigate("manage_hive")}><Text>Manage</Text></Button>
                                <Button
                                    onPress={() => navigation.navigate("graph")}><Text>Graph</Text></Button>
                            </View>
                    </ListItem>
                </List>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    smallTitle: {
        fontWeight: 'bold'
    },
    innerText: {
        color: 'red'
    }
});
