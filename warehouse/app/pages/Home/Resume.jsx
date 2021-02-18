import React from "react";
import { SafeAreaView, View, Text, ScrollView, Image } from "react-native";

import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import tailwind from "tailwind-rn";
import Loading from "../../components/Loading";

const ORDERS_RESUME = gql`
    {
        getOrdersResume {
            unpaidOrders waitingOrders acceptedOrders
            preparationBeganOrders preparationDoneOrders dispatchedOrders
        }
    }
`;

export default function Resume(props) {
    const { data, loading, error } = useQuery(ORDERS_RESUME);

    console.log(data);

    if(!data || loading)
        return <Loading />

    return (
        <SafeAreaView style={tailwind('h-full bg-gray-100')}>
            <View style={tailwind('bg-green-500 h-16 justify-center border-green-500 rounded')}>
                <Text style={tailwind('font-medium text-xl text-white text-center uppercase')}>Résumé</Text>
            </View>
            <View style={tailwind('mt-3')}>
                <ScrollView>
                    <ResumeView count={data.getOrdersResume.unpaidOrders} title="Commandes impayés" icon="../../assets/order-waiting.png" />
                    <ResumeView count={data.getOrdersResume.waitingOrders} title="Commandes en attente" icon="../../assets/order-waiting.png" />
                    <ResumeView count={data.getOrdersResume.acceptedOrders} title="Commandes acceptées" icon="order-approved" />
                    <ResumeView count={data.getOrdersResume.preparationBeganOrders} title="Commandes en préparation" icon="order-waiting" />
                    <ResumeView count={data.getOrdersResume.preparationDoneOrders} title="Commandes terminées" icon="order-waiting" />
                    <ResumeView count={data.getOrdersResume.dispatchedOrders} title="Commandes expédiées" icon="order-waiting" />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const ResumeView = props => (
  <View style={tailwind('mx-2 flex-row items-center h-24 my-2 bg-white border-gray-200 rounded-lg')}>
      <View style={tailwind('w-20')}>
          <Image source={{ uri: props.icon }} style={tailwind('h-16 w-16')} />
      </View>
      <View style={tailwind('flex-1')}>
          <Text style={tailwind('font-bold text-2xl')}>{props.count}</Text>
          <View style={tailwind('my-2')}>
              <Text style={
                  tailwind('font-medium')
              }>{props.title}</Text>
          </View>
      </View>
  </View>
);