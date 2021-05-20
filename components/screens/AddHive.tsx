import {Body, Button, Container, Content, Form, Header, Input, Item, Label, Right, Text, Title} from "native-base";
import React, {useState} from "react";

export function AddHiveScreen({navigation}) {
    const [hiveName,setHiveName]=useState("")
    return (
        <Container>
            <Header noLeft>
                <Body>
                    <Title>Add Hive</Title>
                </Body>
                <Right>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Text>Cancel</Text>
                    </Button>
                </Right>
            </Header>
            <Content>
                <Form>
                    <Item stackedLabel>
                        <Label>Hive name</Label>
                        <Input onChangeText={(value)=>setHiveName(value)} value={hiveName}/>
                    </Item>
                    <Item stackedLabel last>
                        <Label>Hive ip</Label>
                        <Input/>
                    </Item>
                </Form>
            </Content>
        </Container>
    )
}
