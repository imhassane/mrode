import React from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";
import tailwind from "tailwind-rn";

export default function Loading(props) {
    return (
        <SafeAreaView style={tailwind('h-full w-full justify-center items-center')}>
            <ActivityIndicator size="large" />
        </SafeAreaView>
    );
}