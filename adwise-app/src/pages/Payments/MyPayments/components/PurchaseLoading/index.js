import React from "react";
import {SwipeRow} from "react-native-swipe-list-view";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Icon} from "native-base";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import {formatCode, formatMoney} from "../../../../../helper/format";
import Dash from "react-native-dash";
import moment from "moment";

const PurchaseLoading = () => {
    return (
        <View style={styles.card}>
            <View style={styles.cardContainer}>
                <View style={styles.cardLeft}>
                    <View style={{flex: 1}}>
                        <View style={styles.cardPurchaseCodeLoading}/>
                        <View style={styles.cardPurchaseNameLoading}/>
                    </View>
                    <View style={styles.billStatusLoading}/>
                </View>
                <View style={styles.cardSeparate}>
                    <Dash
                        dashGap={2}
                        dashLength={4}
                        dashThickness={4}
                        style={styles.cardSeparateDash}
                        dashStyle={{borderRadius: 100}}
                        dashColor={'white'}
                    />
                </View>
                <View style={styles.cardRight}>
                    <View style={{flex: 1}}>
                        <View style={styles.cardOrganizationNameLoading}/>
                        <Text style={styles.cardDateCreateLoading}/>
                    </View>

                    <View style={styles.cardPriceLoading}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },

    containerInfoDisabled: {
        paddingVertical: 8,
        backgroundColor: '#ff6666',
    },

    cardContainer: {
        position: 'relative',
        borderRadius: 10,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: '#F7F7F7',
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
    cardOrganizationNameLoading: {
        height: 12,
        width: '35%',
        borderRadius: 4,
        backgroundColor: '#DCDCDC',
        marginBottom: 6,
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
    cardDateCreateLoading: {
        backgroundColor: '#DCDCDC',
        borderRadius: 4,
        height: 11,
        width: '90%',
        marginBottom: 24,
        opacity: 0.4
    },
    cardPrice: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 22,
        color: 'black'
    },
    cardPriceLoading: {
        backgroundColor: '#DCDCDC',
        borderRadius: 4,
        height: 18,
        width: '30%',
    },
    cardPurchaseCode: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 18,

        marginBottom: 4
    },
    cardPurchaseCodeLoading: {
        height: 16,
        width: '70%',
        borderRadius: 4,
        backgroundColor: '#DCDCDC',

        marginBottom: 4
    },
    cardPurchaseName: {
        marginBottom: 24,

        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 16,
        color: 'black',
    },
    cardPurchaseNameLoading: {
        height: 14,
        width: '90%',
        borderRadius: 4,
        backgroundColor: '#DCDCDC',
        marginBottom: 24,
    },

    billStatus: {
        fontFamily: 'AtypText_medium',
        fontSize: 11,
        lineHeight: 13,
        letterSpacing: 0.1
    },
    billStatusLoading: {
        borderRadius: 4,
        backgroundColor: '#DCDCDC',
        width: '30%',
        height: 11
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

    buttonTip: {
        paddingVertical: 8,
        width: '100%',

        backgroundColor: '#8152E4'
    },
    buttonTipTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 22,
        textAlign: 'center',
        color: 'white'
    },

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
        fontSize: 10,
        lineHeight: 10,
        marginTop: 4,
        fontFamily: 'AtypDisplay_medium',
        color: '#966EEA'
    },

    bill: {},
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
    },
    swipeRowHiddenNew: {
        width: 64,

        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
    },
    swipeRowHiddenContent: {
        marginTop: -8
    },
    buttonSwipeRow: {
        width: 54,
        flex: 1,
        marginTop: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',

        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default PurchaseLoading
