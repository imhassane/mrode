import React from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import tailwind from "tailwind-rn";

export default class OrderProduct extends React.Component {
    state = {
        counter: 0,
        valid: false,
    }

    updateCounter(value) {
        let { counter } = this.state;
        counter += value;
        if(counter >= 0 && counter <= this.props.orderQuantity) {
            this.setState((state, props) => ({
                counter: state.counter + value,
                valid: (state.counter + value) === props.orderQuantity
            }), () => {
                this.props.setValid(this.props.option.barCode, this.state.valid)
            });
        }
    }

    isValid() {
        return this.state.valid;
    }

    render() {
        const props = this.props;
        return (
            <View style={tailwind('flex-row h-24 mb-3 pb-2 border-b border-gray-200')}>
                <View style={tailwind('h-full w-1/4')}>
                    <Image source={{ uri: props.cover.url }} style={tailwind('w-full h-full')} />
                </View>
                <View style={tailwind('px-3 flex-1')}>
                    <Text style={tailwind('font-medium text-lg')}>{ props.product.name }</Text>
                    <View style={tailwind('flex-row items-center')}>
                        <View style={[tailwind('w-6 h-6 border rounded-full mr-3'), { backgroundColor: props.option.color}]}></View>
                        <View style={tailwind('w-12 bg-gray-200 rounded-lg justify-center items-center mt-2')}>
                            <Text style={tailwind('text-gray-500')}>{ props.option.weight } g</Text>
                        </View>
                    </View>
                </View>
                { props.status === 'PREPARATION' && (
                    <View style={tailwind('w-1/4')}>
                        <TouchableOpacity
                            style={tailwind('bg-gray-200 h-8 items-center justify-center rounded-lg')}
                            onPress={() => props.onShowScanner()}
                        >
                            <Text style={tailwind('text-xs')}>scanner</Text>
                        </TouchableOpacity>
                        <View style={tailwind('mt-2 justify-center')}>
                            <Text style={[tailwind('text-xs'), { color: !this.state.valid ? 'red' : 'green' }]}>
                                { this.state.counter } scans / { props.orderQuantity }
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}