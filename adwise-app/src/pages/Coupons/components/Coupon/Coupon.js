import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    RoundContainerStubs
} from '../../../../components';
import {
    CompanyPageLogo
} from '../../../../icons';
import Dash from "react-native-dash";
import {hexToRGBA} from "../../../../helper/converting";
import axios from "../../../../plugins/axios";
import urls from "../../../../constants/urls";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const Coupon = (props) => {
    const {isLast} = props;
    const [organization, setOrganization] = useState(null);

    useEffect(() => {
        if (props.organization) {
            handleLoadOrganization(props.organization);
        }
    }, [props.organization]);

    const handleLoadOrganization = (id) => {
        axios('get', `${urls["get-organization"]}${id}`).then((response) => {
            setOrganization(response.data.data.organization)
        })
    };
    const handleToCoupon = () => {
        props.navigation.navigate('CouponPage', {
            couponId: props._id
        })
    }

    let color = (organization) ? organization.colors.primary : '';
    const isDisabledOrganization = (organization) ? organization.disabled : false;
    const isDisabledCoupon = props.disabled;
    const isShowImage = !!props.picture;

    const isDisabled = isDisabledOrganization || isDisabledCoupon;
    color = (isDisabled) ? '#b1b1b1' : color;

    return (
        <TouchableOpacity
            style={[styles.coupon, isLast && {marginBottom: 0}, isDisabled && styles.couponDisabled]}
            onPress={(!isDisabled) ? handleToCoupon : null}
            activeOpacity={(!isDisabled) ? 0.2 : 1}
        >
            <View style={[styles.couponLeft, (isDisabled) && { opacity: 0.6 } ]}>
                <View style={[styles.couponLogoContainer, {backgroundColor: color}]}>
                    <RoundContainerStubs styleRoot={{width: 58, height: 58}}>
                        {
                            isShowImage ? (
                                <Image style={styles.couponLogo} resizeMode={'cover'} source={{uri: props.picture}}/>
                            ) : (
                                <CompanyPageLogo color={color}/>
                            )
                        }
                    </RoundContainerStubs>
                </View>

                <View style={{flex: 1}}>
                    <Text style={styles.couponTitle}>{props.name}</Text>
                    <Text style={styles.couponBriefDescription}>{props.organizationBriefDescription}</Text>
                    <Text style={[styles.couponDescription, {color: color}]} numberOfLines={4}>{props.organizationName}</Text>

                    <Text
                        style={[styles.couponPrice, {color: color}]}>{(props.price) ? `${props.price} ₽` : allTranslations(localization.commonNotSpecified)}</Text>

                </View>
            </View>

            <View style={styles.couponSeparate}>
                <Dash
                    dashGap={3}
                    dashLength={3}
                    dashThickness={3}
                    style={styles.dash}
                    dashStyle={{borderRadius: 100}}
                    dashColor={'#c0c0c0'}
                />
            </View>

            <View style={[styles.couponRight, (isDisabled) && { opacity: 0.6 } ]}>
                <Text style={[styles.couponDiscountAmount, {color: color}]}>{props.offer.percent}%</Text>
                <Text style={[styles.couponDiscountDescription, {color: color}]}>{allTranslations(localization.commonCashback)}</Text>

                <TouchableOpacity style={[styles.couponDiscountButton, {backgroundColor: hexToRGBA(color, 0.5)}]}>
                    <Text style={styles.couponDiscountButtonText}>{allTranslations(localization.commonUserApply)}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    coupon: {
        flexDirection: 'row',

        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderRadius: 10,

        marginBottom: 14,

        overflow: 'hidden'
    },

    couponDisabled: {
        backgroundColor: 'rgba(168, 171, 184, 0.09)'
    },

    couponLeft: {
        flex: 1,
        flexDirection: 'row',
        paddingRight: 16
    },
    couponRight: {
        paddingLeft: 16,
        maxWidth: 80,
        width: '100%',

        flexDirection: 'column',
        alignItems: 'flex-start'
    },

    couponSeparate: {
        width: 3
    },

    dash: {
        flexDirection: 'column',
        position: 'absolute',
        top: -16,
        bottom: -16
    },

    couponLogo: {
        borderRadius: 999,
        width: 58,
        height: 58
    },
    couponLogoContainer: {
        width: 74,
        marginVertical: -12,
        marginLeft: -16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14
    },

    couponTitle: {
        fontSize: 16,
        lineHeight: 19,
        fontFamily: 'AtypText_semibold'
    },

    couponBriefDescription: {
        fontSize: 10,
        lineHeight: 13,
        opacity: 0.5,
        fontFamily: 'AtypText_medium',

        marginBottom: 4
    },
    couponDescription: {
        fontSize: 10,
        lineHeight: 13,
        fontFamily: 'AtypText_medium'
    },

    couponDiscountAmount: {
        fontSize: 26,
        lineHeight: 31,
        fontFamily: 'AtypText_bold'
    },
    couponDiscountDescription: {
        fontFamily: 'AtypText_semibold',
        fontSize: 9,
        lineHeight: 9,

        marginBottom: 10
    },

    couponDiscountButton: {
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 4,

        marginTop: 'auto'
    },
    couponDiscountButtonText: {
        fontSize: 8,
        lineHeight: 9,
        fontFamily: 'AtypText_semibold',
        color: 'white'
    },

    couponPrice: {
        fontFamily: 'AtypText_semibold',
        fontSize: 15,
        lineHeight: 18,

        marginTop: 16
    }
});

export default Coupon
