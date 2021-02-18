import React from "react";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyOrders from "../Orders/MyOrders";
import Accepted from "../Orders/Accepted";

const Tab = createMaterialTopTabNavigator();

export default function Orders(props) {
    return (
        <Tab.Navigator>
            <Tab.Screen name="accepted" component={Accepted} options={{ title: "A traiter" }} />
            <Tab.Screen name="myorders" component={MyOrders} options={{ title: "Mes commandes" }} />
        </Tab.Navigator>
    );
}