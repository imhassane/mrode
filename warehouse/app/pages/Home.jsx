import React from "react";

import { View } from "react-native";
import {MaterialCommunityIcons, AntDesign, FontAwesome5} from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Resume from "./Home/Resume";
import Orders from "./Home/Orders";

const Tab = createBottomTabNavigator();



export default function Home() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    return (
                        <View>
                            { route.name === 'resume' && <FontAwesome5 name="home" size={size} color={color} /> }
                            { route.name === 'orders' && <MaterialCommunityIcons name="truck-delivery" size={size} color={color} /> }
                            { route.name === 'account' && <AntDesign name="user" size={size} color={color} />}
                        </View>
                    )
                },
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
                style: {height: 60}
            }}
        >
            <Tab.Screen name="resume" component={Resume} options={{ title: "Accueil" }} />
            <Tab.Screen name="orders" component={Orders} options={{ title: "Commandes" }} />
            <Tab.Screen name="account" component={Orders} options={{ title: "Mon compte" }} />
        </Tab.Navigator>
    )
}