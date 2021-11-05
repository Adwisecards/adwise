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
    const [userFrom, setUserFrom] = useState({});
    const [userTo, setUserTo] = useState({});

    const [isLoadingRequest, setIsLoadingRequest] = useState(true);
    const [isLoadingFrom, setIsLoadingFrom] = useState(true);
    const [isLoadingTo, setIsLoadingTo] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        handleLoadRequest()
    }, [requestId]);
    useEffect(() => {
        if (Object.keys(request).length > 0){
            handleLoadDataFrom();
            // handleLoadDataTo();
        }
    }, [request])

    const handleLoadRequest = () => {
        axios('get', urls["get-request"] + requestId ).then(res => {
            setRequest(res.data.data.request);
            setIsLoadingRequest(false);
        }).catch(error => {
            const errorBody = getError(error.response);
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        })
    }
    const handleLoadDataFrom = () => {
        axios('get', urls["get-contact"] + request.from).then(res => {
            setUserFrom(res.data.data.contact);
            setIsLoadingFrom(false);
        }).catch(error => {
            const errorBody = getError(error.response);
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        })
    }
    const handleLoadDataTo = () => {
        axios('get', urls["get-contact"] + request.to).then(res => {
            setUserTo(res.data.data.contact);
            setIsLoadingTo(false);
        })
    }

    const handleAcceptRequest = async () => {
        setIsSending(true);

        await axios('delete', urls["accept-request"] + requestId).then( res => {
            DropDownHolder.alert('success', 'Успешно', 'Обмен визитками успешен');
        }).catch(error => {
            const errorBody = getError(error.response);
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        })

        await handleUpdateUser()
    }
    const handleCancelRequest = async () => {
        setIsSending(true);

        await axios('delete', urls["cancel-request"] + requestId).then( res => {
            DropDownHolder.alert('success', 'Успешно', 'Вы откланили заявку от пользователя');
        }).catch(error => {
            const errorBody = getError(error.response);
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        })

        await handleUpdateUser()
    }

    const handleUpdateUser = async () => {
        const account = await axios('get', urls["get-me"]).then(res => { return res.data.data.user }).catch(error => {
            const errorBody = getError(error.response);
            DropDownHolder.alert('error', errorBody.title, errorBody.message);

            return false
        });

        props.updateAccount(account)
    }

    if (isLoadingRequest || isLoadingFrom || isLoadingTo){
        return (
            <View style={styles.cardRequest}></View>
        )
    }

    const message = `Пользователь ${ userFrom.lastName.value + ' ' + userFrom.firstName.value } хочет обменяться с вами визитными карточками.`;

    return (
        <View style={styles.cardRequest}>
            <View style={styles.cardRequestHeader}>
                <Text style={styles.cardRequestDateTime}>{ moment(request.timestamp).format('DD.MM.YYYY HH:mm') }</Text>
            </View>

            <Text style={styles.cardRequestDescription}>{ message }</Text>

            <View style={styles.cardRequestControls}>
                <TouchableOpacity style={styles.cardRequestAccept} onPress={handleAcceptRequest}>
                    <Text style={styles.cardRequestAcceptText}>Принять</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardRequestCancel} onPress={handleCancelRequest}>
                    <Text style={styles.cardRequestCancelText}>Отклонить</Text>
                </TouchableOpacity>
            </View>

            {
                isSending && (
                    <View style={styles.cardRequestLoading}>
                        <ActivityIndicator color={'#8152E4'} size={'large'}/>
                    </View>
                )
            }
        </View>
    )
}

const ExchangeRequests = (props) => {
    const { list } = props;

    if (list.length <= 0){
        return null
    }

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Запросы на обмен визитками</Text>
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

export default ExchangeRequests
