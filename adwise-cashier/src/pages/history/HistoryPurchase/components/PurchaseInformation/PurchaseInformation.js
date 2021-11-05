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
import paymentTypes from "../../../../../constants/paymentTypes";

const listStatus = {
    [true]: {
        color: '#94D36C',
        title: 'ОПЛАЧЕН'
    },
    [false]: {
        color: '#FF9494',
        title: 'НЕОПЛАЧЕН'
    }
};

const PurchaseInformation = (props) => {
    const { purchase, isComplete } = props;
    const { offer, sumInPoints, ref, organization, purchaser, cashier, confirmed, processing, complete, coupon, type, usedPoints } = purchase;

    console.log('purchase: ', purchase);

    const [ organizationInfo, setOrganizationInfo ] = useState(organization);
    const [ purchaserInfo, setPurchaserInfo ] = useState(purchaser);
    const [ cashierInfo, setCashierInfo ] = useState(cashier);

    const offerPercent = (offer.percent) ? offer.percent : 0;
    const cashbackAmount = (offerPercent) ? ( (sumInPoints / 100) * offerPercent ) : 0;
    const sumInPointsTotal = sumInPoints - usedPoints;

    return (
        <View style={styles.root}>

            <View style={styles.arrow}>
                <Text style={styles.title}>Тип оплаты</Text>
                <Text style={styles.value}>{ paymentTypes[type] }</Text>
            </View>

            <View style={styles.separate}/>

            <View style={styles.arrow}>
                <Text style={styles.title}>Сумма кэшбэка</Text>
                <Text style={styles.value}>{ formatMoney(cashbackAmount) } ₽</Text>
            </View>

            <View style={styles.separate}/>

            <View style={styles.arrow}>
                <Text style={styles.title}>Номер заказа</Text>
                <Text style={styles.value}>{ formatCode(ref.code) }</Text>
            </View>

            {
                purchaserInfo && (
                    <>
                        <View style={styles.separate}/>

                        <View style={styles.arrow}>
                            <Text style={styles.title}>Покупатель</Text>
                            <Text style={styles.value}>{ `${ (purchaserInfo.firstName) ? purchaserInfo.firstName.value : '' } ${ (purchaserInfo.lastName) ? purchaserInfo.lastName.value : '' }` }</Text>
                        </View>
                    </>
                )
            }

            {
                (purchase.confirmed) && (
                    <View>
                        <View style={styles.separate}/>

                        <View style={styles.arrow}>
                            <Text style={styles.title}>Телефон покупателя</Text>
                            <Text style={styles.value}>{ (purchaserInfo.phone) ? purchaserInfo.phone.value : '-' }</Text>
                        </View>
                    </View>
                )
            }

            {
                (isComplete) && (
                    <View>
                        <View style={styles.separate}/>

                        <View style={styles.arrow}>
                            <Text style={styles.title}>Кассир</Text>
                            <Text style={styles.value}>{ `${ cashierInfo?.firstName?.value || '' } ${ cashierInfo?.lastName?.value || '' }` }</Text>
                        </View>
                    </View>
                )
            }

            <View style={styles.separate}/>

            <View style={styles.arrow}>
                <Text style={styles.title}>Сумма</Text>
                <Text style={styles.value}>{ formatMoney(purchase.sumInPoints) } ₽</Text>
            </View>

            <View style={styles.separate}/>

            <View style={styles.arrow}>
                <Text style={[styles.title, {color: "#93D36C"}]}>Оплачено баллами</Text>
                <Text style={[styles.value, {color: "#93D36C"}]}>{ formatMoney(purchase.usedPoints) } ₽</Text>
            </View>

            <View style={styles.separate}/>

            <View style={styles.arrow}>
                <Text style={[styles.title, {color: "black", fontFamily: "AtypText_medium"}]}>Итого</Text>
                <Text style={[styles.value, {fontFamily: "AtypText_medium"}]}>{formatMoney(sumInPointsTotal, 2, '.')} ₽</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        // marginBottom: 40
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
