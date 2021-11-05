import React, { useEffect, useState } from "react";
import {
    View,

    Text,

    StyleSheet
} from 'react-native';
import {

} from 'native-base';
import {formatCode, formatMoney} from "../../../../../helper/format";
import axios from "../../../../../plugins/axios";
import urls from "../../../../../constants/urls";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const PurchaseInformation = (props) => {
    const { purchase } = props;
    const { offer, sumInPoints, ref, organization, confirmed, processing, complete } = purchase;

    const offerPercent = (offer.percent) ? offer.percent : 0;
    const cashbackAmount = (offerPercent) ? ( (sumInPoints / 100) * offerPercent ) : 0;

    return (
        <View style={styles.root}>

            <View style={styles.arrow}>
                <Text style={styles.title}>{ allTranslations(localization.purchasePurchaseAmount) }</Text>
                <Text style={styles.value}>{ formatMoney(sumInPoints) } ₽</Text>
            </View>

            <View style={styles.separate}/>

            <View style={styles.arrow}>
                <Text style={styles.title}>{ allTranslations(localization.purchaseCashbackAmount) }</Text>
                <Text style={styles.value}>{ formatMoney(cashbackAmount) } ₽</Text>
            </View>

            <View style={styles.separate}/>

            <View style={styles.arrow}>
                <Text style={styles.title}>{ allTranslations(localization.purchaseOrderNumber) }</Text>
                <Text style={styles.value}>{ formatCode(ref.code) }</Text>
            </View>

            <View style={styles.separate}/>

            <View style={styles.arrow}>
                <Text style={styles.title}>{ allTranslations(localization.purchaseSeller) }</Text>
                <Text style={styles.value}>{ organization.name }</Text>
            </View>

            {
                (confirmed) && (
                    <>

                        <View style={styles.separate}/>

                        <View style={styles.arrow}>
                            <Text style={styles.title}>{ allTranslations(localization.purchasePaidPoints) }</Text>
                            <Text style={styles.value}>{ formatMoney(0) } ₽</Text>
                        </View>

                    </>
                )
            }

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        marginBottom: 40
    },

    arrow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        paddingVertical: 10
    },
    title: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 23,
        letterSpacing: 1,
        color: '#808080'
    },
    value: {
        flex: 1,
        textAlign: 'right',

        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 23,
        letterSpacing: 1
    },

    separate: {
        width: '100%',
        height: 1,

        backgroundColor: '#E8E8E8'
    },

    billStatus: {
        flex: 1,
        textAlign: 'right',

        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 23,
        letterSpacing: 1
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
});

export default PurchaseInformation
