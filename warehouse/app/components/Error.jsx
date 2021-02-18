import React from "react";
import { View, Text } from "react-native";
import tailwind from "tailwind-rn";

export default function Error(props) {
    return (
        <View style={tailwind('h-16 px-4 bg-red-200 border-l-4 border-red-500 justify-center text-white text-sm rounded-lg my-2')}>
            <Text>{ props.message }</Text>
        </View>
    );
}