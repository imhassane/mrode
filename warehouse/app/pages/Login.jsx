import React from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from "react-native";
import {useMutation} from "@apollo/react-hooks";

import AsyncStorage from "@react-native-async-storage/async-storage";
import gql from "graphql-tag";
import tailwind from 'tailwind-rn';

const AUTHENTICATE = gql`
    mutation ($accessCode: Int!, $password: Int!) {
        authenticateMember(accessCode: $accessCode, accessPassword: $password) {
            token
        }
    }
`;

const Home = (props) => {
    const [accessCode, setAccessCode] = React.useState('213246');
    const [password, setPassword] = React.useState('213246');

    const [sendLoginData, {loading, error}] = useMutation(AUTHENTICATE);

    const login = async () => {
        const {data} = await sendLoginData({
            variables: { accessCode: parseInt(accessCode), password: parseInt(password) }
        });

        const session = JSON.parse(await AsyncStorage.getItem("@session") || "{}");
        const stringify = JSON.stringify({ ...session, authToken: data.authenticateMember.token })
        AsyncStorage.setItem("@session", stringify);

        props.navigation.navigate('home');
    };

    if(error) {
        if(error.graphQLErrors && error.graphQLErrors.length)
            alert(error.graphQLErrors[0].message);
        else
            alert(error.message);
    }


    return (
        <SafeAreaView style={tailwind('h-full pt-24 justify-center flex')}>
            <View>
                <Text style={tailwind('text-green-600 font-bold text-3xl text-center')}>MRODE</Text>
            </View>
            <View style={tailwind('px-4 mt-10')}>
                <View>
                    <Text style={tailwind('font-semibold mb-3')}>Code d'accès</Text>
                    <TextInput
                        style={tailwind('border border-green-500 rounded-sm h-10 px-2')}
                        onTextChange={text => setAccessCode(text)}
                        value={accessCode}
                    />
                </View>
                <View style={tailwind('my-4')}>
                    <Text style={tailwind('font-semibold mb-3')}>Mot de passe</Text>
                    <TextInput
                        style={tailwind('border border-green-500 rounded-sm h-10 px-2')}
                        onTextChange={text => setPassword(text)}
                        value={password}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={tailwind('bg-green-500 h-10 justify-center rounded-sm')}
                        onPress={login}
                    >
                        <Text style={tailwind('text-white font-medium text-center')}>Se connecter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Home;
