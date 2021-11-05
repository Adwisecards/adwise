import React, {useState, useEffect} from "react";
import {
    View,

    Text,

    FlatList,
    SafeAreaView,

    StyleSheet,

    ListView,

    TouchableOpacity,

    ActivityIndicator, TouchableHighlight
} from 'react-native';
import {
    RefreshControl
} from '../../../../../components';
import {Icon} from "native-base";
import moment from "moment";
import Swipeout from "react-native-swipeout";
import commonStyles from "../../../../../theme/variables/commonStyles";
import axios from "../../../../../plugins/axios";
import urls from "../../../../../constants/urls";
import {formatCode, formatMoney} from "../../../../../helper/format";
import {getItemAsync, setItemAsync} from "../../../../../helper/SecureStore";
import Dash from "react-native-dash";
import {SwipeRow} from "react-native-swipe-list-view";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const Row = (props) => {
    const {purchase, listDisabledOrders, onChangeListDisabled} = props;

    if (listDisabledOrders && listDisabledOrders.indexOf(purchase._id) <= -1) {
        return null
    }

    const isCanceled = Boolean(purchase.canceled);

    const handleToBill = () => {
        props.navigation.navigate('PaymentPurchase', {
            purchaseId: purchase._id
        })
    }

    const isCoupons = Boolean(purchase?.coupons && purchase.coupons.length > 1);

    return (
        <SwipeRow
            style={stylesCard.card}
            disableRightSwipe={true}
            rightOpenValue={-64}
        >

            <View style={styles.swipeRowHidden}>
                <TouchableHighlight
                    onPress={() => onChangeListDisabled(purchase)}
                >
                    <View style={styles.buttonArchive}>
                        <Icon type="Feather" name="archive" style={{color: '#966EEA'}}/>
                        <Text style={styles.buttonArchiveText}>{allTranslations(localization.commonReturn)}</Text>
                    </View>
                </TouchableHighlight>
            </View>

            <View style={{flexDirection: 'row'}}>
                <View style={stylesCard.cardLeft}>
                    <View style={{flex: 1}}>
                        <Text style={stylesCard.cardPurchaseCode}>{allTranslations(localization.purchaseOrder)} {formatCode(purchase.ref.code)}</Text>
                        {
                            isCoupons ? (
                                <>
                                    <Text style={stylesCard.cardPurchaseName}>
                                        {allTranslations(localization.paymentsTotalCountPurchaseTotalCountPurchase, {
                                            coupons: purchase.coupons.length
                                        })}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text style={stylesCard.cardPurchaseName}>{purchase.coupon.name}, 1 {allTranslations(localization.commonCountMini)}</Text>
                                </>
                            )
                        }
                    </View>

                    <Text style={[
                        stylesCard.billStatus,
                        (purchase.canceled) && stylesCard.billStatusCanceled,
                        (!purchase.canceled && purchase.confirmed && !purchase.complete) && stylesCard.billStatusConfirmed,
                        (!purchase.canceled && !purchase.confirmed && !purchase.processing) && stylesCard.billStatusNotConfirmed,
                        (!purchase.canceled && purchase.processing && !purchase.confirmed) && stylesCard.billStatusProcessing,
                        (!purchase.canceled && purchase.confirmed && purchase.complete) && stylesCard.billStatusConfirmed,
                    ]}>
                        {(purchase.canceled) && allTranslations(localization.purchaseStatusCanceled)}
                        {(!purchase.canceled && purchase.confirmed && !purchase.complete) && allTranslations(localization.purchaseStatusPaid)}
                        {(!purchase.canceled && !purchase.confirmed && !purchase.processing) && allTranslations(localization.purchaseStatusNotPaid)}
                        {(!purchase.canceled && purchase.processing && !purchase.confirmed) && allTranslations(localization.purchaseStatusDuring)}
                        {(!purchase.canceled && purchase.confirmed && purchase.complete) && allTranslations(localization.purchaseStatusCompleted)}
                    </Text>
                </View>
                <View style={stylesCard.cardSeparate}>
                    <Dash
                        dashGap={2}
                        dashLength={4}
                        dashThickness={4}
                        style={stylesCard.cardSeparateDash}
                        dashStyle={{borderRadius: 100}}
                        dashColor={'white'}
                    />
                </View>
                <View style={stylesCard.cardRight}>
                    <View style={{flex: 1}}>
                        <Text style={stylesCard.cardOrganizationName}>{purchase.coupon.organizationName}</Text>
                        <Text
                            style={stylesCard.cardDateCreate}>{moment(purchase.timestamp).format('DD.MM.YYYY / HH:mm')}</Text>
                    </View>

                    <Text style={stylesCard.cardPrice}>{formatMoney(purchase.sumInPoints)} ₽</Text>
                </View>
            </View>

        </SwipeRow>
    )
}

const Table = (props) => {
    const {listDisabledOrders, onChangeListDisabledOrders} = props;

    const handleChangeListDisabled = async (item) => {
        let newListDisabledOrders = (!!listDisabledOrders) ? [...listDisabledOrders] : [];
        let indexItem = newListDisabledOrders.indexOf(item._id);

        newListDisabledOrders.splice(indexItem, 1);

        onChangeListDisabledOrders(newListDisabledOrders);
        await setItemAsync('list-disabled-orders', newListDisabledOrders);
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <FlatList
                data={props.rows}
                extraData={props.rows}

                contentContainerStyle={commonStyles.container}

                renderItem={({item}) => {
                    return (
                        <Row purchase={item} listDisabledOrders={listDisabledOrders}
                             onChangeListDisabled={handleChangeListDisabled} {...props}/>
                    )
                }}

                refreshControl={
                    <RefreshControl
                        refreshing={props.refreshing}
                        onRefresh={props.onRefresh}

                    />
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {},

    swipeout: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderRadius: 10,
    },

    buttonArchive: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonArchiveText: {
        fontSize: 12,
        marginTop: 8,
        fontFamily: 'AtypDisplay_medium',
        color: '#966EEA'
    },

    bill: {
        backgroundColor: 'white',

        borderRadius: 10,

        marginBottom: 8
    },
    billContent: {
        paddingVertical: 20,
        paddingHorizontal: 24,
    },
    billLoading: {
        height: 70,
    },
    billHead: {
        marginBottom: 8
    },
    billBody: {
        flexDirection: 'row'
    },
    billTitle: {
        fontSize: 22,
        lineHeight: 24,
        fontFamily: 'AtypText'
    },
    billDate: {
        fontFamily: 'AtypText',
        fontSize: 15,
        lineHeight: 18,
        color: '#9FA3B7'
    },

    billStatus: {
        marginLeft: 'auto',

        fontFamily: 'AtypText_medium',
        fontSize: 15,
        lineHeight: 18
    },
    billStatusConfirmed: {
        color: '#94D36C'
    },
    billStatusNotConfirmed: {
        color: '#FF9494'
    },
    billStatusProcessing: {
        color: '#ED8E00'
    },

    couponName: {
        fontSize: 16,
        lineHeight: 20,
        color: '#25233E',
        fontFamily: 'AtypText',

        marginBottom: 8
    },

    swipeRowHidden: {
        width: 64,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,

        backgroundColor: '#EADEFE',
    }
});
const stylesCard = StyleSheet.create({
    card: {
        borderRadius: 10,

        flexDirection: 'row',

        overflow: 'hidden',

        backgroundColor: '#F7F7F7',

        marginBottom: 12,

        elevation: 2
    },

    cardLeft: {
        width: '60%',
        backgroundColor: 'white',

        paddingHorizontal: 16,
        paddingVertical: 14
    },
    cardRight: {
        padding: 12,

        width: '40%',
        backgroundColor: '#F7F7F7'
    },
    cardSeparate: {
        width: 5,
        height: '100%',
        zIndex: 999,
        marginRight: -3.5
    },
    cardSeparateDash: {
        flexDirection: 'column',
        position: 'absolute',
        top: -16,
        bottom: -16
    },

    cardOrganizationName: {
        marginBottom: 6,

        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 13,
        color: 'black',
        opacity: 0.4
    },
    cardDateCreate: {
        marginBottom: 24,

        fontFamily: 'AtypText',
        fontSize: 11,
        lineHeight: 13,
        color: 'black',
        opacity: 0.4
    },
    cardPrice: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 22,
        color: 'black'
    },
    cardPurchaseCode: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 18,

        marginBottom: 4
    },
    cardPurchaseName: {
        marginBottom: 24,

        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 16,
        color: 'black',
    },

    billStatus: {
        fontFamily: 'AtypText_medium',
        fontSize: 11,
        lineHeight: 13,
        letterSpacing: 0.1
    },
    billStatusConfirmed: {
        color: '#94D36C'
    },
    billStatusCanceled: {
        color: '#E1C117'
    },
    billStatusNotConfirmed: {
        color: '#FF9494'
    },
    billStatusProcessing: {
        color: '#ED8E00'
    },
});

export default Table
