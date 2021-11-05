import React, { useState } from "react";
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {getMediaUrl} from "../../../../../common/media";
import {formatMoney} from "../../../../../helper/format";
import IconCouponPlug from "../../../../../icons/plugs/coupon";
import currency from "../../../../../constants/currency";
import Dash from "react-native-dash";
import moment from "moment";

const Coupon = (props) => {
    const { coupon, organizationColor, routeOpenCoupon } = props;
    const [isCheckDescription, setCheckDescription] = useState(true);
    const [isOpenDescription, setOpenDescription] = useState(true);
    const [isShowButtonMore, setShowButtonMore] = useState(false);

    const handleDescriptionOnLayout = ({ nativeEvent }) => {
        const lines = nativeEvent?.lines || [];

        if (lines.length > 3 && isCheckDescription) {
            setOpenDescription(false);
            setShowButtonMore(true);
            setCheckDescription(false);
        }
    }

    return (
        <TouchableOpacity
            style={styles.coupon}
            onPress={() => routeOpenCoupon(coupon?._id)}
        >

            <View style={styles.container}>

                <View style={styles.image}>

                    {

                        Boolean( coupon?.pictureMedia ) ? (
                            <Image
                                source={{ uri: getMediaUrl( coupon?.pictureMedia ) }}
                                style={{ flex: 1 }}
                            />
                        ) : (
                            <IconCouponPlug color={organizationColor}/>
                        )

                    }

                </View>

                <View style={styles.content}>

                    <Text style={styles.couponName}>{ coupon?.name }</Text>

                    <Text style={styles.couponDescription} numberOfLines={3}>
                        { coupon?.description }
                    </Text>

                    <Text style={[styles.couponPrice, { color: organizationColor }]}>{ formatMoney(coupon?.price) } { currency.rub }</Text>

                </View>

                <View style={styles.dash}>
                    <Dash
                        dashGap={3}
                        dashLength={3}
                        dashThickness={3}
                        style={styles.dashComponent}
                        dashStyle={{borderRadius: 100}}
                        dashColor={'#c0c0c0'}
                    />
                </View>

                <View style={styles.informations}>

                    <Text style={styles.organizationName}>{ coupon?.organizationName }</Text>

                    <View style={styles.couponCashback}>
                        <Text style={[styles.couponCashbackTitle, { color: organizationColor }]}>Кэшбэк</Text>
                        <Text style={[styles.couponCashbackValue, { color: organizationColor }]}>{ coupon?.offer?.percent }%</Text>
                    </View>

                    <View style={styles.couponDate}>
                        <Text style={[styles.couponDateTitle, { color: organizationColor }]}>Действует до</Text>
                        <Text style={[styles.couponDateValue, { color: organizationColor }]}>{ moment(coupon?.endDate).format('DD.MM.YY') }</Text>
                    </View>

                </View>

            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    coupon: {
        backgroundColor: 'white',
        marginBottom: 16,
        borderRadius: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    container: {
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        overflow: "hidden",
    },
    image: {
        width: 75,
        marginLeft: -12,
        marginVertical: -8,
        backgroundColor: 'rgba(196, 196, 196, 0.15)'
    },
    content: {
        flex: 1,
        paddingHorizontal: 12,
        flexShrink: 1,
    },
    buttonMore: {
        marginTop: -8,
        marginBottom: 12
    },
    buttonMoreText: {
        fontFamily: 'AtypText',
        fontSize: 10
    },

    couponName: {
        fontFamily: "AtypText_semibold",
        fontSize: 13,
        lineHeight: 16,
        color: 'black',
        flex: 1,
        marginBottom: 4
    },
    couponDescription: {
        fontFamily: 'AtypText',
        fontSize: 10,
        lineHeight: 11,
        color: '#808080',
        flex: 1,
        marginBottom: 8
    },
    couponPrice: {
        fontFamily: 'AtypText_semibold',
        fontSize: 14,
        lineHeight: 17
    },

    couponCashback: {
        marginBottom: 8
    },
    couponCashbackTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 9,
        lineHeight: 9,
        marginBottom: 4
    },
    couponCashbackValue: {
        fontFamily: 'AtypText_semibold',
        fontSize: 12,
        lineHeight: 12
    },

    couponDate: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    couponDateTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 9,
        lineHeight: 9,
        marginBottom: 4
    },
    couponDateValue: {
        fontFamily: 'AtypText_semibold',
        fontSize: 12,
        lineHeight: 12
    },

    dash: {
        marginVertical: -8,
        width: 3
    },
    dashComponent: {
        flexDirection: 'column',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },

    informations: {
        width: 88,
        paddingLeft: 12
    },

    organizationName: {
        fontFamily: 'AtypText_semibold',
        fontSize: 11,
        lineHeight: 13,
        letterSpacing: -0.02,
        color: '#000000',

        marginBottom: 16
    },


});

export default Coupon
