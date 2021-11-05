import React from "react";
import {SwipeRow} from "react-native-swipe-list-view";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Icon} from "native-base";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import {formatCode, formatMoney} from "../../../../../helper/format";
import Dash from "react-native-dash";
import moment from "moment";

const Purchase = (props) => {
    const {purchase, onSendTips, onGiveCoupon, onAddArchive} = props;
    const isCompleted = purchase.confirmed && purchase.complete;
    const isActiveShareCoupon = Boolean(!purchase.canceled && purchase.confirmed && !purchase.complete);
    const isCanceled = Boolean(purchase.canceled);
    const isTips = Boolean(!purchase.tips && isCompleted && purchase.organization.tips);

    const handleToBill = () => {
        props.navigation.navigate('PaymentPurchase', {
            purchaseId: purchase._id
        })
    }
    const handleSendPurchase = () => {
        onGiveCoupon(purchase);
    }
    const _getStatus = () => {
        if (purchase.canceled) {
            return allTranslations(localization.purchaseStatusCanceled)
        }
        if (!purchase.canceled && purchase.shared && purchase.confirmed && !purchase.complete) {
            return 'Подарок'
        }
        if (!purchase.canceled && purchase.confirmed && !purchase.complete) {
            return allTranslations(localization.purchaseStatusPaid)
        }
        if (!purchase.canceled && !purchase.confirmed && !purchase.processing) {
            return allTranslations(localization.purchaseStatusNotPaid)
        }
        if (!purchase.canceled && purchase.processing && !purchase.confirmed) {
            return allTranslations(localization.purchaseStatusDuring)
        }
        if (!purchase.canceled && purchase.confirmed && purchase.complete) {
            return allTranslations(localization.purchaseStatusCompleted)
        }
    }
    const _getColor = () => {
        if (purchase.canceled) {
            return '#1DA8F6'
        }
        if (!purchase.canceled && purchase.shared && purchase.confirmed && !purchase.complete) {
            return '#02D1C5'
        }
        if (!purchase.canceled && purchase.confirmed && !purchase.complete) {
            return '#61AE2C'
        }
        if (!purchase.canceled && !purchase.confirmed && !purchase.processing) {
            return '#D8004E'
        }
        if (!purchase.canceled && purchase.processing && !purchase.confirmed) {
            return '#ED8E00'
        }
        if (!purchase.canceled && purchase.confirmed && purchase.complete) {
            return '#8152E4'
        }
    }
    const _getIsArchived = () => {
        if (
            !purchase.canceled && purchase.confirmed && purchase.complete ||
            !purchase.canceled && !purchase.confirmed && !purchase.processing
        ) {
            return true
        }

        return false
    }

    const isCoupons = Boolean(purchase?.coupons && purchase.coupons.length > 1);
    const isOrganizationDisabled = Boolean(purchase?.organization?.disabled || false);
    const isCouponDisabled = Boolean(purchase?.coupon?.disabled || false);
    const isDisabled = Boolean(isOrganizationDisabled || isCouponDisabled);

    return (
        <SwipeRow
            style={styles.card}
            disableRightSwipe={true}
            rightOpenValue={-68}
        >
            <View style={styles.swipeRowHiddenNew}>
                <View style={styles.swipeRowHiddenContent}>
                    <TouchableOpacity
                        style={styles.buttonSwipeRow}
                        activeOpacity={isActiveShareCoupon ? 0.3 : 1}
                        onPress={isActiveShareCoupon ? handleSendPurchase : null}
                    >
                        <Icon
                            type="Feather"
                            name="external-link"
                            style={{color: isActiveShareCoupon ? '#966EEA' : '#DCDCDC', fontSize: 16}}
                        />
                        <Text
                            style={[styles.buttonArchiveText, {color: isActiveShareCoupon ? '#966EEA' : '#DCDCDC'}]}
                            numberOfLines={1}
                        >
                            {allTranslations(localization.commonShare)}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonSwipeRow}
                        activeOpacity={_getIsArchived() ? 0.3 : 1}
                        onPress={() => _getIsArchived() ? onAddArchive(purchase) : null}
                    >
                        <Icon
                            type="Feather"
                            name="archive"
                            style={{color: _getIsArchived() ? '#966EEA' : '#DCDCDC', fontSize: 16}}
                        />
                        <Text
                            style={[
                                styles.buttonArchiveText,
                                {color: _getIsArchived() ? '#966EEA' : '#DCDCDC'}
                            ]}
                        >
                            {allTranslations(localization.purchaseButtonsToArchive)}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.cardContainer}>
                <View style={styles.cardContent}>
                    <TouchableOpacity
                        style={{flexDirection: 'row'}}
                        onPress={(isCanceled || isDisabled) ? null : handleToBill}
                    >
                        <View style={styles.cardLeft}>
                            <View style={{flex: 1}}>
                                <Text style={styles.cardPurchaseCode}>
                                    {allTranslations(localization.purchaseOrder)} {formatCode(purchase.ref.code)}
                                </Text>

                                {
                                    isCoupons ? (
                                        <>
                                            <Text style={styles.cardPurchaseName}>
                                                {allTranslations(localization.paymentsTotalCountPurchaseTotalCountPurchase, {
                                                    coupons: purchase.coupons.length
                                                })}
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Text style={styles.cardPurchaseName}>
                                                {purchase.coupon.name}, 1 {allTranslations(localization.commonCountMini)}
                                            </Text>
                                        </>
                                    )
                                }
                            </View>

                            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                <View style={[
                                    styles.purchaseStatus,
                                    {
                                        backgroundColor: _getColor()
                                    }
                                ]}>
                                    <Text style={styles.purchaseStatusText}>{_getStatus()}</Text>
                                </View>
                            </View>
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
                                <Text style={styles.cardOrganizationName}>{purchase.coupon.organizationName}</Text>
                                <Text
                                    style={styles.cardDateCreate}>{moment(purchase.timestamp).format('DD.MM.YYYY / HH:mm')}</Text>
                            </View>

                            <Text style={styles.cardPrice}>{formatMoney(purchase.sumInPoints)} ₽</Text>
                        </View>
                    </TouchableOpacity>

                    {
                        (!isDisabled && isTips && !isCanceled) && (
                            <TouchableOpacity style={styles.buttonTip} onPress={() => onSendTips(props.purchase)}>
                                <Text
                                    style={styles.buttonTipTitle}>{allTranslations(localization.commonLeaveTip)}</Text>
                            </TouchableOpacity>
                        )
                    }

                    {
                        (isDisabled) && (
                            <View style={styles.containerInfoDisabled}>
                                <Text style={styles.buttonTipTitle}>
                                    { isOrganizationDisabled ? allTranslations(localization.commonOrganizationDisabled) : allTranslations(localization.commonCouponDisabled)}
                                </Text>
                            </View>
                        )
                    }
                </View>
            </View>
        </SwipeRow>
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

    purchaseStatus: {
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 36
    },
    purchaseStatusText: {
        fontFamily: 'AtypText_medium',
        fontSize: 10,
        lineHeight: 10,
        color: 'white'
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

export default Purchase
