import React from "react";
import {SafeAreaView, Text, View, FlatList, Image, TouchableOpacity, Modal} from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import {useMutation, useQuery} from "@apollo/react-hooks";

import gql from "graphql-tag";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import OrderProduct from "../../components/OrderProduct";
import tailwind from "tailwind-rn";

import { renderOrder } from "../../utils";

const ORDER = gql`
    query ($id: ID!) {
        getOrder(id: $id) {
            id, num, status,
            acceptedBy { id, fullName },
            preparationBeganBy { id, fullName },
            preparationDoneBy { id, fullName },
            dispatchedBy { id, fullName }
            orderProducts {
                product { id, name }
                option { barCode color weight }
                cover { url }
                orderPrice
                orderQuantity
            }
        }
    }
`;

const UPDATE_PRODUCT_STATUS = gql`
    mutation ($id: ID!, $status: OrderStatus!) {
        updateOrderStatus(id: $id, status: $status) { id }
    }
`;

export default function Details(props) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [hasPermission, setHasPermission] = React.useState(null);
    const [scanned, setScanned] = React.useState(false);
    const [orderDone, setOrderDone] = React.useState(false);
    const [orderStatus, setOrderStatus] = React.useState(null);

    // Sera utilisé pour enregistrer les références du composant OrderProduct.
    let options = {};

    // On demande les permissions pour l'accès à la caméra
    React.useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // Chargement des données
    const { data, loading, error } = useQuery(ORDER, {
        fetchPolicy: "no-cache",
        variables: { id: props.route.params.id }
    });
    const [updatedAcceptedOrder, acceptedOrderData] = useMutation(UPDATE_PRODUCT_STATUS);
    const [updatedPreparationOrder, preparationOrderData] = useMutation(UPDATE_PRODUCT_STATUS);
    const [updatedDoneOrder, doneOrderData] = useMutation(UPDATE_PRODUCT_STATUS);

    if(loading || acceptedOrderData.loading || preparationOrderData.loading || doneOrderData.loading)
        return <Loading />;

    // Scan
    const handleScan = async ({ data: barCode }) => {
        for(let p of data.getOrder.orderProducts) {
            if(p.option.barCode === barCode) {
                await options[barCode].el.current.updateCounter(1);
            }
        }
        // On bloque le scan
        setScanned(true)
    };

    // Validation du scan d'un produit
    const handleUpdateOptionValidity = (option, valid) => {
        options[option].valid = valid;
    }

    // Validation du scan d'une commande
    const handleScanClose = () => {
        let valid = true;
        for(const o of Object.keys(options)) {
            valid = valid && options[o].el.current.isValid();
        }
        setOrderDone(valid);
    };

    const handleUpdateToPreparation = async () => {
        try {
            await updatedAcceptedOrder({ variables: { id: props.route.params.id, status: "PREPARATION"  } });
            setOrderStatus('PREPARATION');
        } catch (ex) {
            if(ex.graphQLErrors && ex.graphQLErrors.length)
                alert(ex.graphQLErrors[0].message);
            else
                alert(ex.message);
        }
    }

    const handleUpdateToPreparationDone = async () => {
        try {
            await updatedAcceptedOrder({variables: {id: props.route.params.id, status: "PREPARATION_DONE"}});
            setOrderStatus('DISPATCHED');
            setOrderDone(false);
        } catch(ex) {
            if(ex.graphQLErrors && ex.graphQLErrors.length)
                alert(ex.graphQLErrors[0].message);
            else
                alert(ex.message);
        }
    }

    const handleUpdateToDispatched = async () => {
        try {
            await updatedAcceptedOrder({variables: {id: props.route.params.id, status: "DISPATCHED"}});
        } catch (ex) {
            if(ex.graphQLErrors && ex.graphQLErrors.length)
                alert(ex.graphQLErrors[0].message);
            else
                alert(ex.message);
        }
    }

    return (
        <SafeAreaView>
            { error && <Error message="Une erreur est survenue" /> }
            { !error && (
                <View style={tailwind('bg-white h-full items-center')}>
                    <View style={tailwind('w-full h-40 justify-center items-center border-b border-gray-300')}>
                        <Text style={tailwind('font-bold text-xl')}>#{ data.getOrder.num }</Text>
                        <Text style={tailwind('my-2 text-xs')}>ID de la commande: {data.getOrder.id}</Text>
                        <View style={tailwind('my-2 w-32 h-6 bg-blue-500 items-center justify-center rounded-full')}>
                            <Text style={tailwind('text-sm text-white font-medium')}>{ renderOrder(orderStatus ? orderStatus :data.getOrder.status) }</Text>
                        </View>
                    </View>

                    { orderDone && (
                        <View style={tailwind('my-3 pb-2 w-full h-16 justify-center items-center border-b border-gray-300')}>
                            <TouchableOpacity
                                onPress={handleUpdateToPreparationDone}
                                style={tailwind('py-4 px-3 border border-green-500 bg-green-500 rounded-lg')}
                            >
                                <Text style={tailwind('text-white font-medium')}>Terminer la préparation de la commande</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    { data.getOrder.status === 'ACCEPTED' && !orderStatus && (
                        <View style={tailwind('my-3 pb-2 w-full h-16 justify-center items-center border-b border-gray-300')}>
                            <TouchableOpacity
                                onPress={handleUpdateToPreparation}
                                style={tailwind('py-4 px-3 border border-green-500 bg-green-500 rounded-lg')}
                            >
                                <Text style={tailwind('text-white font-medium')}>Commencer la préparation de la commande</Text>
                            </TouchableOpacity>
                        </View>
                    )
                    }

                    { (data.getOrder.status === 'PREPARATION_DONE' || orderStatus === 'DISPATCHED') && (
                        <View style={tailwind('my-3 pb-2 w-full h-16 justify-center items-center border-b border-gray-300')}>
                            <TouchableOpacity
                                onPress={handleUpdateToDispatched}
                                style={tailwind('py-4 px-3 border border-green-500 bg-green-500 rounded-lg')}
                            >
                                <Text style={tailwind('text-white font-medium')}>Marquer comme expédiée</Text>
                            </TouchableOpacity>
                        </View>
                    )
                    }

                    <View style={tailwind('mt-5 w-11/12 bg-white rounded-lg')}>
                        <FlatList
                            data={data.getOrder.orderProducts}
                            keyExtractor={item => item.option.barCode }
                            renderItem={ ({ item }) => {
                                const reference = React.createRef();
                                options[item.option.barCode] = { el: reference, valid: false  };
                                return <OrderProduct {...item}
                                                     ref={reference}
                                                     onShowScanner={() => setModalVisible(true)}
                                                     setValid={handleUpdateOptionValidity}
                                                     status={orderStatus ? orderStatus : data.getOrder.status}
                                        />
                            } }
                        />
                    </View>
                </View>
            )}

            <Modal
                transparent={false}
                visible={modalVisible} animationType="slide"
            >
                <SafeAreaView style={tailwind('bg-gray-200 h-full justify-center items-center')}>
                    { hasPermission === null && <Text>Demande d'autorisation d'accès à la caméra</Text> }
                    { hasPermission === false && <Text>L'accès à la caméra n'a pas été autorisé</Text> }

                    <View style={tailwind('h-64 w-11/12')}>
                        <BarCodeScanner
                            onBarCodeScanned={scanned ? undefined : handleScan}
                            style={tailwind('w-full h-full')}
                        />
                    </View>

                    { scanned && (
                        <View style={tailwind('my-5 w-11/12')}>
                            <TouchableOpacity
                                onPress={() => setScanned(false) }
                                style={tailwind('bg-green-500 rounded-lg justify-center py-4 w-full')}
                            >
                                <Text style={tailwind('text-white font-medium text-center')}>Continuer</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={tailwind('items-center mt-5 w-full')}>
                        <TouchableOpacity
                            style={tailwind('w-11/12 bg-green-500 py-4 rounded-lg')}
                            onPress={() => {
                                handleScanClose()
                                setModalVisible(false)
                            }}
                        >
                            <Text style={tailwind('text-white font-medium text-center')}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};