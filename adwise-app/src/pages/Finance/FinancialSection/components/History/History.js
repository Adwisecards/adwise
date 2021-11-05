import React from "react";
import {
    View,

    Text,

    StyleSheet,

    TouchableOpacity
} from 'react-native';
import moment from "moment";
import {formatMoney} from "../../../../../helper/format";
import localization from "../../../../../localization/localization";
import allTranslations from "../../../../../localization/allTranslations";

const History = (props) => {

    const _routeAllHistory = () => {
        props.navigate.navigate('FinanceAllHistory');
    }

    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.title}>{allTranslations(localization.financialSectionHistoryTitle)}</Text>
            </View>

            {
                (props.items && props.items.length > 0) && (
                    <View style={styles.content}>
                        {
                            props.items.map((item, idx) => {
                                if (item.type === 'marketing') {
                                    return (
                                        <RowMarketing key={'element-marketing-' + idx} {...item}/>
                                    )
                                }
                                if (item.type === 'purchase') {
                                    return (
                                        <RowPurchase key={'element-purchase-' + idx} {...item}/>
                                    )
                                }
                                if (item.type === 'withdrawal') {
                                    return (
                                        <RowWithdrawal key={'element-withdrawal-' + idx} {...item}/>
                                    )
                                }
                                if (item.type === 'usedPoints') {
                                    return (
                                        <RowUsePoints key={'element-use-points-' + idx} {...item}/>
                                    )
                                }
                            })
                        }
                    </View>
                )
            }

            {
                Boolean(props.items?.length > 50) && (
                    <TouchableOpacity style={styles.buttonMore} onPress={_routeAllHistory}>
                        <Text style={styles.buttonMoreText}>{allTranslations(localization.financeHistory)}</Text>
                    </TouchableOpacity>
                )
            }

        </View>
    )
}

const RowMarketing = (props) => {
    return (
        <View style={styles.row}>
            <View style={styles.rowLeft}>
                <Text
                    style={styles.typographyDate}>{`${moment(props.timestamp).format('DD.MM')}\n${moment(props.timestamp).format('YYYY')}`}</Text>
            </View>
            <View style={styles.rowCenter}>
                <Text style={[styles.typographyName]}>{props.organizationName}</Text>
                <Text style={styles.typographyDescription}>
                    {
                        allTranslations(localization.financialSectionHistoryRowMarketing, {
                            couponName: props.couponName,
                            price: `${formatMoney(props.sum, 2, '.')}₽`,
                            level: props.level
                        })
                    }
                </Text>
            </View>
            <View style={styles.rowRight}>
                <Text style={styles.typographyAmount}>
                    +{formatMoney(props.refPoints, 2, '.')} ₽
                </Text>
            </View>
        </View>
    )
};
const RowPurchase = (props) => {
    return (
        <View style={styles.row}>
            <View style={styles.rowLeft}>
                <Text
                    style={styles.typographyDate}>{`${moment(props.timestamp).format('DD.MM')}\n${moment(props.timestamp).format('YYYY')}`}</Text>
            </View>
            <View style={styles.rowCenter}>
                <Text style={[styles.typographyName]}>{props.organizationName}</Text>
                <Text style={styles.typographyDescription}>
                    {
                        allTranslations(localization.financialSectionHistoryRowPurchase, {
                            couponName: props.couponName,
                            price: `${formatMoney(props.sum, 2, '.')}₽`
                        })
                    }
                </Text>
            </View>
            <View style={styles.rowRight}>
                <Text style={styles.typographyAmount}>
                    +{formatMoney(props.bonusPoints, 2, '.')} ₽
                </Text>
            </View>
        </View>
    )
};
const RowWithdrawal = (props) => {
    return (
        <View style={styles.row}>
            <View style={styles.rowLeft}>
                <Text
                    style={styles.typographyDate}>{`${moment(props.timestamp).format('DD.MM')}\n${moment(props.timestamp).format('YYYY')}`}</Text>
            </View>
            <View style={styles.rowCenter}>
                <Text
                    style={[styles.typographyName]}>{allTranslations(localization.financialSectionHistoryRowWithdrawal)}</Text>
                <Text style={[styles.typographyDescription]}>{formatMoney(props.sum, 2, '.')}₽</Text>
            </View>
            <View style={styles.rowRight}>
                <Text style={[styles.typographyAmount, {color: '#8152E4'}]}>
                    -{formatMoney(props.sum, 2, '.')} ₽
                </Text>
            </View>
        </View>
    )
};
const RowUsePoints = (props) => {
    return (
        <View style={styles.row}>
            <View style={styles.rowLeft}>
                <Text
                    style={styles.typographyDate}>{`${moment(props.timestamp).format('DD.MM')}\n${moment(props.timestamp).format('YYYY')}`}</Text>
            </View>
            <View style={styles.rowCenter}>
                <Text style={[styles.typographyName]}>
                    {allTranslations(localization.financialSectionHistoryRowUsePoints, {
                        couponName: props.couponName,
                        organizationName: props.organizationName,
                    })}
                </Text>
                <Text style={[styles.typographyDescription]}></Text>
            </View>
            <View style={styles.rowRight}>
                <Text style={[styles.typographyAmount, {color: '#8152E4'}]}>
                    -{formatMoney(props.sum, 2, '.')} ₽
                </Text>
            </View>
        </View>
    )
};

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

        marginBottom: 12
    },
    rowLeft: {
        marginRight: 12
    },
    rowCenter: {
        flex: 1,
        paddingRight: 24
    },
    rowRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },

    typographyDate: {
        fontFamily: 'AtypText',
        fontSize: 12,
        lineHeight: 14,
        opacity: 0.3
    },
    typographyName: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 15
    },
    typographyDescription: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 15,
        color: '#808080'
    },
    typographyAmount: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 26,
        color: '#ED8E00'
    },
    typographyIcon: {},

    buttonMore: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#ED8E00',
        borderRadius: 8,

        marginTop: 16
    },
    buttonMoreText: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 16,
        color: 'white'
    },
})

export default History
