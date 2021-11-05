import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    CompanyPageLogo
} from '../../../../../icons';
import {
    Icon
} from "native-base";
import Dash from "react-native-dash";
import Svg, {Path} from "react-native-svg";
import {DropDownHolder} from "../../../../../components";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const Coupon = (props) => {
    const {organization, color, isLast, isBuy} = props;
    const isDisabledOrganization = (organization) ? organization.disabled : false;
    const isDisabledCoupon = props.disabled;
    const isShowImage = !!props.picture;

    const isDisabled = isDisabledOrganization || isDisabledCoupon || props.quantity === 0;

    if (isDisabled) {
        return null
    }

    const handleTapCoupon = () => {
        if (isBuy) {
            return null
        }

        props.onAdd({ ...props, count: 1 });
    }

    const handleAdd = () => {
        let newCount = props.count+1;

        if (newCount > props.quantity){
            DropDownHolder.alert('info', allTranslations(localization.commonSystemNotification), allTranslations(localization.companyPagesYouGaveReachedMaximumCoupons));

            return null
        }

        props.onChangeCount(props._id, newCount)
    }
    const handleMinus = () => {
        if (props.count <= 1){
            props.onDelete(props._id);

            return null
        }

        props.onChangeCount(props._id, props.count-1)
    }

    return (
        <View style={[styles.coupon, isLast && {marginBottom: 0}, isBuy && styles.couponBuy]}>
            <TouchableOpacity style={styles.couponContainer} onPress={handleTapCoupon}>
                <View style={styles.couponLeft}>

                    <View style={[styles.couponLogoContainer, {backgroundColor: color}]}>
                        {
                            isBuy && (
                                <View style={styles.couponLogoBackground}>
                                    <View style={styles.buyChecked}>
                                        <Svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M15.6371 1.34047L15.6373 1.3406L17.193 2.89636C17.312 3.01544 17.3672 3.14733 17.3671 3.32067V3.32094C17.3671 3.49484 17.3119 3.6267 17.193 3.74563L8.91007 12.0286L8.91007 12.0286L7.35422 13.5843C7.23528 13.7032 7.10337 13.7584 6.92965 13.7584C6.75546 13.7584 6.62385 13.7032 6.5054 13.5847L6.50522 13.5845L4.94919 12.0286L4.94918 12.0286L0.807677 7.88713L0.807614 7.88707C0.689028 7.76853 0.633789 7.63661 0.633789 7.46265C0.633789 7.28851 0.688982 7.15679 0.807647 7.03815L0.807685 7.03811L2.36361 5.48215C2.36361 5.48215 2.36361 5.48215 2.36361 5.48215C2.48227 5.36349 2.6139 5.30834 2.78814 5.30834C2.96199 5.30834 3.09357 5.36337 3.21219 5.48187C3.21228 5.48196 3.21237 5.48206 3.21247 5.48215L6.57549 8.85664L6.92931 9.21166L7.28347 8.85697L14.7886 1.34047C14.907 1.22203 15.0387 1.16675 15.213 1.16675C15.387 1.16675 15.5188 1.22198 15.6371 1.34047Z" fill="#8152E4"/>
                                        </Svg>
                                    </View>
                                </View>
                            )
                        }
                        {
                            isShowImage ? (
                                <Image style={styles.couponLogo} resizeMode={'cover'} source={{uri: props.picture}}/>
                            ) : (
                                <CompanyPageLogo color={color}/>
                            )
                        }
                    </View>

                    <View style={{flex: 1}}>
                        <Text style={styles.couponTitle}>{props.name}</Text>
                        <Text style={styles.couponBriefDescription}>{props.organizationBriefDescription}</Text>
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

                <View style={styles.couponRight}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.couponOrganizationName, {color: isBuy ? '#8152E4' : color}]} numberOfLines={4}>{props.organizationName}</Text>
                        <Text style={[styles.couponDiscountAmount, {color: isBuy ? '#8152E4' : color}]}>{props?.offer?.percent || 0}%</Text>
                        <Text style={[styles.couponDiscountDescription, {color: isBuy ? '#8152E4' : color}]}>{allTranslations(localization.commonCashback)}</Text>
                    </View>
                    <Text style={[styles.couponPrice, {color: isBuy ? '#8152E4' : color}]}>{(props.price) ? `${props.price} ₽` : allTranslations(localization.commonNotSpecified)}</Text>
                </View>
            </TouchableOpacity>

            {
                isBuy && (
                    <View style={styles.buyControlers}>
                        <Text style={styles.buyControlerTitle}>{allTranslations(localization.companyPagesBuyCouponCount)}</Text>
                        <View style={styles.buyControlerRight}>
                            <TouchableOpacity style={styles.buyControlerButton} onPress={handleMinus}>
                                <Icon name="minus" type="Feather" style={{ fontSize: 15, color: 'white' }}/>
                            </TouchableOpacity>
                            <Text style={styles.buyControlerCount}>{ props.count }</Text>
                            <TouchableOpacity style={styles.buyControlerButton} onPress={handleAdd}>
                                <Icon name="plus" type="Feather" style={{ fontSize: 15, color: 'white' }}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    coupon: {
        borderRadius: 10,

        marginBottom: 14,

        overflow: 'hidden',

        borderWidth: 3,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0)'
    },
    couponBuy: {
        backgroundColor: '#8152E4',
        borderColor: '#8152E4'
    },
    couponContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
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
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1
    },
    couponLogoBackground: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 3,
        backgroundColor: 'rgba(129, 82, 228, 0.6)',
        justifyContent: 'center',
        alignItems: 'center'
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
        fontFamily: 'AtypText_medium'
    },
    couponDescription: {
        fontSize: 10,
        lineHeight: 13,
        fontFamily: 'AtypText_medium'
    },
    couponOrganizationName: {
        fontSize: 10,
        lineHeight: 13,
        marginBottom: 4,
        fontFamily: 'AtypText_semibold'
    },

    couponDiscountAmount: {
        fontSize: 26,
        lineHeight: 31,
        fontFamily: 'AtypText_bold'
    },
    couponDiscountDescription: {
        fontFamily: 'AtypText_semibold',
        fontSize: 9,
        lineHeight: 9
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
    },

    buyChecked: {
        width: 40,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buyControlers: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#8152E4',
        paddingVertical: 6,
        paddingHorizontal: 8,
        paddingLeft: 16
    },
    buyControlerTitle: {
        fontFamily: 'AtypDisplay_medium',
        fontSize: 15,
        color: 'white'
    },
    buyControlerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buyControlerButton: {
        width: 35,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        opacity: 0.3,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'white'
    },
    buyControlerCount: {
        width: 30,
        fontSize: 16,
        lineHeight: 19,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'AtypDisplay_medium',
        marginHorizontal: 8
    },
});

export default Coupon
