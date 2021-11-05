import React, { useEffect, useState } from 'react';
import {
    View,

    Text,

    StyleSheet
} from 'react-native';
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const TableProducts = (props) => {
    const { purchase } = props;

    const couponData = (purchase.coupon && purchase.coupon.name) ? purchase.coupon.name : '';

    if (!couponData){
        return null
    }

    const [coupons, setCoupons] = useState({});

    useEffect(() => {
        let data = {};
        purchase.coupons.map((coupon) => {
            if (!data[coupon._id]) {
                data[coupon._id] = {
                    coupon: coupon,
                    count: 0
                }
            }

            data[coupon._id]['count'] = data[coupon._id]['count'] + 1
        })
        setCoupons(data)
    }, [purchase]);

    return (
        <View style={styles.root}>

            {
                Object.keys(coupons).map((key, idx) => {
                    const coupon = coupons[key]['coupon'];

                    return (
                        <View style={[styles.row, idx % 2 !== 0 && styles.rowDark]}>
                            <View style={styles.rowLeft}>
                                <Text style={styles.rowName}>{ coupon?.name || '' }</Text>
                            </View>
                            <Text style={styles.rowCount}>{coupons[key]['count']} {allTranslations(localization.commonCountMini)}</Text>
                        </View>
                    )
                })
            }

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: 'rgba(168, 171, 184, 0.05)',

        borderRadius: 8,

        overflow: 'hidden',

        marginBottom: 32
    },

    row: {
        padding: 12,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowDark: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)'
    },
    rowLeft: {
        maxWidth: '70%'
    },
    rowName: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 17,

        flex: 1
    },
    rowCount: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 17,

        paddingRight: 12
    },
})

export default TableProducts
