import React from "react";
import { SafeAreaView, View, Text, FlatList, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack"

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import tailwind from "tailwind-rn";

import { getDateDiff, renderOrder } from "../../utils";

import Loading from "../../components/Loading";
import Error from "../../components/Error";
import Details from "./Details";

const Stack = createStackNavigator();

const ORDERS = gql`
    {
        getNonClosedOrders(count: 30) {
            id, num, insertedAt
            status
            acceptedBy { fullName }
            preparationBeganBy { id, fullName },
            preparationDoneBy { id, fullName },
            dispatchedBy { id, fullName }
        }
    }
`;

function Accepted(props) {

    const {data, loading, error} = useQuery(ORDERS, {
        pollInterval: 1000 * 5,
    });

    if(loading)
        return <Loading />;

    return (
        <SafeAreaView>
            { error && <Error message={error} /> }
            <FlatList
                keyExtractor={item => item.id }
                data={data.getNonClosedOrders}
                renderItem={ ({item}) => <OrderResume {...item} navigation={props.navigation} /> }
            />
        </SafeAreaView>
    )
};

export default function() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="accepted" component={Accepted} options={{title: "Liste des commandes"}} />
            <Stack.Screen name="details" component={Details} options={{title: "Commande"}} />
        </Stack.Navigator>
    );
}

const OrderResume = props => {
    return (
        <TouchableOpacity
            onPress={() => props.navigation.navigate('details', { id: props.id })}
            style={tailwind('flex-row m-2 bg-white border-white border rounded-lg h-24 py-4 px-4')}
        >
            <View style={tailwind('flex-1')}>
                <Text style={tailwind('font-medium uppercase')}>{ props.num }</Text>
                <Text style={tailwind('mt-2')}>{ renderOrder(props.status) }</Text>
                <View style={tailwind('w-24 justify-center bg-yellow-500 my-2 h-5 border-yellow-500 border rounded-full')}>
                    <Text style={tailwind('text-white text-xs font-medium text-center')}>Depuis: { getDateDiff(new Date(), new Date(props.insertedAt)) }h</Text>
                </View>
            </View>
            { props.status !== 'ACCEPTED' && (
                <View style={tailwind('flex-1 items-end')}>
                    <View style={tailwind('w-32 bg-blue-500 h-6 justify-center rounded-full')}>
                        <Text style={tailwind('text-xs text-center font-medium text-white')}>{ renderOrderWorker(props) }</Text>
                    </View>
                </View>
            )
            }
        </TouchableOpacity>
    );
};

const renderOrderWorker = order => {
    if(order.status === 'ACCEPTED') return order.acceptedBy.fullName;
    else if(order.status === 'PREPARATION') return order.preparationBeganBy.fullName;
    else if(order.status === 'PREPARATION_DONE') return order.preparationDoneBy.fullName;
    else if(order.status === 'DISPATCHED') return order.dispatchedBy.fullName;
    return "Inconnu";
}
