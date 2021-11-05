import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {formatMoney} from "../../../../../helper/format";
import {
    Icon
} from "native-base";
import allTranslations from "../../../../../localization/allTranslations";
import currency from "../../../../../constants/currency";
import localization from "../../../../../localization/localization";

const Footer = (props) => {
    const {
        couponPrice,
        cashback,
        organizationColor,
        organizationColorOpacity,
        invitationQrCode,
        invitationLink,

        isAgeMore,
        isFloating,
        isCouponHide,
        isAvailability,
        isAgeRestricted,
        isOrganizationSubscription,

        onShareCoupon,
        onBuyCoupon,
        onEventShareCoupon,

        getCoupon,
        buyCoupon,
        onReturnCouponFromHidden,
        onSubscribeOrganizationAndGetCoupon,
        routeContactOrganization
    } = props;

    const [ isOpenQrCode, setOpenQrCode ] = useState(false);

    if (isAgeRestricted && !isAgeMore) {
        return null
    }

    const handleButtonText = () => {
        if (!isAvailability) {
            return "Получить"
        }
        if (isOrganizationSubscription && !isCouponHide) {
            return "Оплатить"
        }
        if (isOrganizationSubscription && isCouponHide) {
            return "Вернуть"
        }

        return "Получить"
    }
    const handleShareCoupon = () => {
        onShareCoupon();
    }
    const handleOpenQrCode = () => {
        setOpenQrCode(!isOpenQrCode);
    }
    const handleOnTapButton = () => {
        if (!isAvailability) {
            return getCoupon;
        }
        if (!isOrganizationSubscription) {
            return onSubscribeOrganizationAndGetCoupon
        }
        if (isOrganizationSubscription && !isCouponHide) {
            return buyCoupon
        }
        if (isOrganizationSubscription && isCouponHide) {
            return onReturnCouponFromHidden
        }

        return getCoupon;
    }

    return (
        <View style={styles.root}>

            <View style={styles.header}>
                <Text style={styles.price}>{`${isFloating ? 'от ' : ''}${ formatMoney(couponPrice) } ${ currency.rub }`}</Text>
                <Text style={[styles.cashback, { color: organizationColor }]}>{ `${allTranslations(localization.commonCashback)} ${ cashback }%` }</Text>
            </View>

            {
                Boolean(!isFloating) && (
                    <View style={styles.controls}>

                        <TouchableOpacity style={[styles.control, { flex: 1, backgroundColor: organizationColor }]} onPress={handleOnTapButton()}>
                            <Text style={styles.controlText}>{ handleButtonText() }</Text>
                        </TouchableOpacity>

                        {
                            isAvailability && (
                                <>

                                    <TouchableOpacity style={[styles.control, styles.controlMini, { backgroundColor: organizationColorOpacity }]} onPress={handleShareCoupon}>
                                        <Icon name="share-2" type="Feather" style={styles.controlText}/>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.control, styles.controlMini, { backgroundColor: organizationColorOpacity }, isOpenQrCode && { backgroundColor: organizationColor }]}
                                        onPress={handleOpenQrCode}
                                    >
                                        <Icon name="qrcode" type="FontAwesome5" style={styles.controlText}/>
                                    </TouchableOpacity>

                                </>
                            )
                        }

                    </View>
                )
            }

            {
                Boolean(isFloating) && (
                    <View style={styles.controls}>

                        <TouchableOpacity style={[styles.control, { flex: 1, backgroundColor: organizationColor }]} onPress={routeContactOrganization}>
                            <Text style={styles.controlText}>Связаться с компанией</Text>
                        </TouchableOpacity>

                    </View>
                )
            }

            {
                Boolean( isOpenQrCode ) && (
                    <View style={styles.invitationQrCodeContainer}>
                        <Image
                            style={styles.invitationQrCode}
                            source={{ uri: invitationQrCode }}
                            resizeMode="contain"
                        />
                    </View>
                )
            }

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        backgroundColor: 'white'
    },

    header: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    price: {
        fontFamily: 'AtypText_semibold',
        fontSize: 30,
        lineHeight: 39,
        color: 'black'
    },
    cashback: {
        fontFamily: 'AtypText',
        fontSize: 15,
        lineHeight: 30
    },

    controls: {
        flexDirection: 'row',
        marginLeft: -16
    },
    control: {
        height: 36,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16
    },
    controlMini: {
        width: 36
    },
    controlText: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 18,
        color: 'white'
    },

    invitationQrCodeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40
    },
    invitationQrCode: {
        width: 156,
        height: 156
    }
});

export default Footer
