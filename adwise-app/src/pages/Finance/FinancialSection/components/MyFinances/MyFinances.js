import React from "react";
import {
    View,

    Text,

    StyleSheet,

    TouchableOpacity
} from 'react-native';
import {} from '../../../../../icons';
import {formatMoney} from "../../../../../helper/format";

import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import moment from "moment";

const MyFinances = (props) => {
    const { onCreateWithdrawalFunds, app } = props;
    const { wallet } = app;

    const handleToEnrollment = () => {
        if (!wallet) {
            return 0
        }

        if (wallet.frozenPoints.length <= 0) {
            return null
        }

        const frozenPoints = wallet.frozenPoints;

        return frozenPoints.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.sum
        }, 0)
    }

    return (
        <View style={styles.root}>

            <View style={styles.header}>
                <Text style={styles.title}>{ allTranslations(localization.financialSectionMyFinancesTitle) }</Text>

                {
                    !!props.updatedAt && (
                        <>
                            <Text style={styles.textUpdateTime}>{ allTranslations(localization.financialSectionMyFinancesTimeUpdatedAt) } <Text style={{color: '#8152E4'}}>{ moment(props.updatedAt).format('DD.MM.YYYY HH:mm') }</Text></Text>
                        </>
                    )
                }
            </View>

            <View style={[styles.content, {marginBottom: 8}]}>

                <View style={[styles.row, { marginBottom: 8 }]}>
                    <Text style={[styles.rowTitle, styles.rowTitleBig]}>{ allTranslations(localization.financialSectionMyFinancesYourBalance) }</Text>
                    <Text style={[styles.rowValue, styles.rowValueBig]}>
                        { formatMoney((props.wallet) ? props.wallet.points : 0, 2, '.') } ₽
                    </Text>
                </View>

                <View style={[styles.row, { marginBottom: 16 } ]}>
                    <Text style={[styles.rowTitle]}>{ allTranslations(localization.financialSectionMyFinancesToEnrollment) }</Text>
                    <Text style={[styles.rowValue, { color: '#808080' }]}>{ formatMoney(handleToEnrollment()) } ₽</Text>
                </View>

                <View style={styles.row}>

                    <TouchableOpacity
                        style={styles.buttonWithdrawalFunds}
                        onPress={onCreateWithdrawalFunds}
                    >
                        <Text style={styles.buttonWithdrawalFundsText}>{ allTranslations(localization.financialSectionMyFinancesButtonWithdrawalFunds) }</Text>
                    </TouchableOpacity>

                </View>

            </View>

            <View style={styles.content}>

                <View style={styles.row}>
                    <Text style={styles.rowTitle}>{ allTranslations(localization.financialSectionMyFinancesChecks) }</Text>
                    <Text style={styles.rowValue}>{ (props.purchases) ? props.purchases.length : 0 }</Text>
                </View>

                <View style={styles.rowSeparate}/>

                <View style={styles.row}>
                    <Text style={styles.rowTitle}>{ allTranslations(localization.financialSectionMyFinancesPurchaseAmount) }</Text>
                    <Text style={styles.rowValue}>{ formatMoney(props.purchaseSum, 2, '.') } ₽</Text>
                </View>

                <View style={styles.rowSeparate}/>

                <View style={styles.row}>
                    <Text style={styles.rowTitle}>{ allTranslations(localization.financialSectionMyFinancesRewards) }</Text>
                    <Text style={styles.rowValue}>{ formatMoney(props.bonusSum, 2, '.') } ₽</Text>
                </View>

                <View style={styles.rowSeparate}/>

                <View style={styles.row}>
                    <Text style={styles.rowTitle}>{ allTranslations(localization.financialSectionMyFinancesUsedPointsSum) }</Text>
                    <Text style={styles.rowValue}>{ formatMoney(props.usedPointsSum, 2, '.') } ₽</Text>
                </View>

                <View style={styles.rowSeparate}/>

                <View style={styles.row}>
                    <Text style={styles.rowTitle}>{ allTranslations(localization.financialSectionMyFinancesWithdrawalSum) }</Text>
                    <Text style={styles.rowValue}>{ formatMoney(props.withdrawalSum, 2, '.') } ₽</Text>
                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {},

    header: {
        marginBottom: 16
    },

    title: {
        fontFamily: 'AtypText_medium',
        fontSize: 24,
        lineHeight: 26
    },

    content: {
        backgroundColor: 'white',

        borderRadius: 10,

        padding: 16,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowSeparate: {
        width: '100%',
        height: 1,
        backgroundColor: '#E8E8E8',
        marginVertical: 8
    },

    textUpdateTime: {
        marginTop: 4,

        fontFamily: 'AtypText',
        fontSize: 12,
        lineHeight: 14
    },

    rowTitle: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 23,
        opacity: 0.5
    },
    rowTitleBig: {
        fontSize: 18
    },
    rowValue: {
        fontFamily: 'AtypText_medium',
        fontSize: 17,
        lineHeight: 24
    },
    rowValueBig: {
        fontSize: 20
    },

    buttonWithdrawalFunds: {
        backgroundColor: '#ED8E00',
        borderRadius: 5,

        paddingVertical: 6,
        paddingHorizontal: 24
    },
    buttonWithdrawalFundsText: {
        fontFamily: 'AtypDisplay_medium',
        fontSize: 16,
        lineHeight: 18,
        color: 'white'
    },
})

export default MyFinances
