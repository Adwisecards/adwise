import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
} from "react-native";
import {
    RatingStar as RatingStarIcon
} from "../../../../../icons";
import {NumericalReliability} from "../../../../../helper/numericalReliability";
import {formatMoney} from "../../../../../helper/format";

const InformationsTable = (props) => {
    const {
        productsCount,
        sumInPoints,
        currency,
        usedPoints,
        cashback,
        order,
        purchaseStatus,
        qrCode,
        messageFromOrganization,

        rating,
        review,
        isPurchaseReviewSent
    } = props;

    return (
        <View style={styles.root}>

            <Text style={styles.title}>Сумма заказа</Text>

            <View style={styles.table}>

                <View style={styles.row}>
                    <Text style={styles.rowLeft}>{productsCount} {NumericalReliability(productsCount, ['товар', 'товара', 'товаров'])}</Text>
                    <Text style={styles.rowRight}>{formatMoney(sumInPoints)} {currency}</Text>
                </View>

                {
                    Boolean(purchaseStatus === 'paid' || purchaseStatus === 'completed') && (
                        <>

                            <View style={styles.separate}/>

                            <View style={styles.row}>
                                <Text style={[styles.rowLeft, {color: '#61AE2C'}]}>Кэшбэк</Text>
                                <Text style={[styles.rowRight, {color: '#61AE2C'}]}>{formatMoney(cashback)} {currency}</Text>
                            </View>

                        </>
                    )
                }

                {
                    Boolean(purchaseStatus === 'paid' || purchaseStatus === 'completed') && (
                        <>

                            <View style={styles.separate}/>

                            <View style={styles.row}>
                                <Text style={[styles.rowLeft, {color: '#D62222'}]}>Оплачено баллами </Text>
                                <Text style={[styles.rowRight, {color: '#D62222'}]}>{formatMoney(usedPoints)} {currency}</Text>
                            </View>

                        </>
                    )
                }

                <View style={styles.separate}/>

                <View style={styles.row}>
                    <Text style={[styles.rowLeft]}>Номер заказа</Text>
                    <Text style={[styles.rowRight]}>{order}</Text>
                </View>

                {
                    Boolean(messageFromOrganization !== 'Покупка из приложения' && messageFromOrganization !== 'Покупка из CRM') && (
                        <>

                            <View style={styles.separate}/>

                            <View style={styles.row}>
                                <Text style={[styles.rowLeft]}>{`Сообщение\nот продавца`}</Text>
                                <Text style={[styles.rowRight]}>{messageFromOrganization}</Text>
                            </View>

                        </>
                    )
                }

            </View>

            {
                Boolean(purchaseStatus === 'completed') && (
                    <View style={styles.qrCodeContainer}>

                        <View style={styles.qrCode}>
                            <Image
                                style={{flex: 1}}
                                source={{uri: qrCode}}
                            />
                        </View>

                        <Text style={styles.qrCodeOrder}>{order}</Text>

                    </View>
                )
            }

            {
                isPurchaseReviewSent && (
                    <View style={styles.sectionReviewOrder}>
                        <Text style={styles.titleReview}>Ваша оценка заказа</Text>

                        {
                            Boolean((rating || 0) > 0) && (
                                <View style={styles.ratingsContainer}>
                                    {
                                        [1, 2, 3, 4, 5].map((item) => (
                                            <View style={{marginLeft: 16}}>
                                                <RatingStarIcon
                                                    color={item <= rating ? '#8152E4' : '#E8E8E8'}
                                                />
                                            </View>
                                        ))
                                    }
                                </View>
                            )
                        }

                        {
                            Boolean(!!review) && (
                                <Text style={styles.commentReview}>{review}</Text>
                            )
                        }

                    </View>
                )
            }

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        marginBottom: 24
    },
    title: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 18,
        color: '#25233E',
        marginBottom: 10
    },

    table: {},
    row: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    rowLeft: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 20,
        color: '#808080'
    },
    rowRight: {
        fontFamily: 'AtypText',
        textAlign: 'right',
        fontSize: 14,
        lineHeight: 20,
        color: '#25233E',
        flex: 1
    },

    separate: {
        width: '100%',
        height: 1,
        backgroundColor: '#EAEBF0',
        marginVertical: 8
    },

    qrCodeContainer: {
        backgroundColor: '#f3f3f3',
        borderRadius: 6,
        marginTop: 32,
        padding: 18,
        justifyContent: 'center',
        alignItems: 'center'
    },
    qrCode: {
        width: 165,
        height: 165,
        marginBottom: 24
    },
    qrCodeOrder: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 22,
        color: '#25233E',
        textAlign: 'center'
    },


    sectionReviewOrder: {
        marginTop: 40,
    },
    titleReview: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: '#808080',
        textAlign: 'center',
        marginBottom: 16
    },
    commentReview: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 17,
        color: '#25233E'
    },
    ratingsContainer: {
        flexDirection: 'row',
        marginLeft: -16,
        marginBottom: 16
    }
});

export default InformationsTable
