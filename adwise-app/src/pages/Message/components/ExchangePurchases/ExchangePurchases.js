import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import urls from "../../../../constants/urls";
import axios from "../../../../plugins/axios";
import moment from "moment";
import getError from "../../../../helper/getErrors";
import {DropDownHolder} from "../../../../components";
import {loadContact} from "../../../../AppState";

const CardRequest = (props) => {
    const { requestId } = props;

    const [request, setRequest] = useState({});
    const [isLoadingRequest, setIsLoadingRequest] = useState(true);

    useEffect(() => {
        handleLoadRequest()
    }, [requestId]);

    const handleLoadRequest = () => {
        axios('get', urls["get-purchase"] + requestId ).then(res => {
            setRequest(res.data.data.purchase);
            setIsLoadingRequest(false);
        }).catch(error => {
            const errorBody = getError(error.response);
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        })
    }
    const handleToDeal = () => {
        props.navigation.navigate('PaymentPurchase', {
            purchaseId: requestId
        })
    }

    return (
        <View style={styles.cardRequest}>
            <View style={styles.cardRequestHeader}>
                <Text style={styles.cardRequestDateTime}>{ moment(request.timestamp).format('DD.MM.YYYY HH:mm') }</Text>
            </View>

            <Text style={styles.cardRequestDescription}>{ request.description }</Text>

            <View style={styles.cardRequestControls}>
                <TouchableOpacity style={styles.cardRequestAccept} onPress={handleToDeal}>
                    <Text style={styles.cardRequestAcceptText}>Оплатить</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const ExchangePurchases = (props) => {
    const { list } = props;

    if (list.length <= 0){
        return null
    }

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Заказы</Text>
            </View>

            {
                list.map((requestId, idx) => (
                    <CardRequest requestId={requestId} {...props}/>
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    root: {},

    header: {
        marginBottom: 16
    },
    headerTitle: {
        fontSize: 20,
        lineHeight: 22,
        fontFamily: 'AtypText_medium'
    },

    cardRequest: {
        position: 'relative',

        padding: 16,
        borderRadius: 8,
        backgroundColor: 'white'
    },
    cardRequestLoading: {
        position: 'absolute',
        zIndex: 1,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',

        justifyContent: 'center',
        alignItems: 'center'
    },
    cardRequestHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 8
    },
    cardRequestDateTime: {},
    cardRequestDescription: {
        fontSize: 18,
        lineHeight: 22,
        fontFamily: 'AtypText'
    },
    cardRequestControls: {
        marginTop: 8
    },
    cardRequestAccept: {
        width: '100%',
        paddingVertical: 8,

        backgroundColor: '#8152E4',
        borderRadius: 4,

        marginBottom: 8
    },
    cardRequestAcceptText: {
        color: 'white',
        fontSize: 14,
        lineHeight: 14,
        textAlign: 'center',
        fontFamily: 'AtypText_medium'
    },
    cardRequestCancel: {
        width: '100%',
        paddingVertical: 8,

        borderRadius: 4,

        borderColor: '#8152E4',
        borderWidth: 1,
        borderStyle: 'solid'
    },
    cardRequestCancelText: {
        color: '#8152E4',
        fontSize: 14,
        lineHeight: 14,
        textAlign: 'center',
        fontFamily: 'AtypText_medium'
    },
})

export default ExchangePurchases
