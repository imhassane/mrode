import React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { View, Text, SafeAreaView } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApolloProvider } from '@apollo/client';

import makeApolloClient from "./apollo";

import Login from "./app/pages/Login";
import Home from "./app/pages/Home";

const Stack = createStackNavigator();

export default function App() {
    const [client, setClient] = React.useState(null);

    const fetchSession = async () => {
        // fetch session
        const session = await AsyncStorage.getItem('@session');
        const { authToken } = JSON.parse(session || "{}");

        const client = makeApolloClient(authToken);

        setClient(client);
    }

    React.useEffect(() => {
        fetchSession();
    }, []);

    if (!client) {
        return (
            <View><Text>Chargement en cours</Text></View>
        );
    }

  return (
      <ApolloProvider client={client}>
          <NavigationContainer>
              <Stack.Navigator>
                  <Stack.Screen name="home" component={Home} options={{
                      headerLeft: null,
                  }} />
                  <Stack.Screen name="login" component={Login} />
              </Stack.Navigator>
          </NavigationContainer>
      </ApolloProvider>
  );
}

