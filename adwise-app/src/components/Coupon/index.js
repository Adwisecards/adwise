import React, {useState, useRef} from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {} from "react-navigation";
import {
    Icon
} from "native-base";
import {
    Hide,
    Anchor
} from "../../icons";
import {SwipeListView, SwipeRow} from "react-native-swipe-list-view";

import Swipeout from "react-native-swipeout";
import Dash from "react-native-dash";
import {formatMoney} from "../../helper/format";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";
import moment from "moment";

const {width} = Dimensions.get('window');

const Coupon = (props) => {
    const {
        name,
        description,
        price,
        picture,
        disabled,
        organization,
        titleButtonHide,
        organizationName,
        onAddCouponFavorite,
        onRemoveCouponFavorite,
        onHideCoupon,
        favoriteCouponsIds,
        isHideSwipe,
        isNotOpen,
        isHideAnchor
    } = props;

    const refSwipeRow = useRef();

    const isImageCoupon = Boolean(picture);
    const isFavorite = favoriteCouponsIds.indexOf(props._id) > -1;

    const [isOpenDescription, setOpenDescription] = useState(false);
    const [isShowButtonOpenDescription, setShowButtonOpenDescription] = useState(false);

    const colorsPrimary = organization?.colors?.primary || '#8152E4';
    const organizationLogo = organization.picture;
    const isOrganizationDisabled = Boolean(organization?.disabled || false);
    const isCouponEmpty = Boolean(props.quantity <= 0);
    const isCouponDisabled = Boolean(disabled || false);
    const isDisabled = Boolean(isOrganizationDisabled || isCouponDisabled || isCouponEmpty);

    const handleOnDescriptionLayout = (props) => {
        const {nativeEvent} = props;

        if (nativeEvent.lines.length > 5) {
            setShowButtonOpenDescription(true)
        }
    }
    const handleOnOpenDescription = () => {
        const openDescription = (isOpenDescription) ? false : true;

        setOpenDescription(openDescription);
    }

    const handleHideCoupon = () => {
        refSwipeRow.current?.closeRow();
        onHideCoupon(props._id);
    }
    const handleAnchorCoupon = () => {
        refSwipeRow.current?.closeRow();

        if (isFavorite) {
            onRemoveCouponFavorite(props._id);

            return null
        }
        onAddCouponFavorite(props);
    }

    const handleOpenCoupon = () => {
        if (isNotOpen) {
            return null
        }

        props.navigation.navigate('CouponPage', {
            couponId: props._id,
            colorPrimary: colorsPrimary
        });
    }

    return (
        <SwipeRow
            ref={refSwipeRow}
            style={{marginBottom: 12}}
            disableRightSwipe={true}
            disableLeftSwipe={isHideSwipe}
            rightOpenValue={-64}
            closeOnRowPress={true}
        >

            <View style={styles.swipeRowHidden}>
                <View style={styles.swipeoutBtnsRight}>
                    {
                        (!isHideAnchor) && (
                            <View style={(props.disabled) && {opacity: 0.5}}>
                                <TouchableOpacity
                                    style={[styles.swipeoutButton, {marginBottom: 8}]}
                                    onPress={handleAnchorCoupon}
                                    disabled={props.disabled}
                                >
                                    <View style={styles.swipeoutButtonIconContainer}>
                                        <Anchor/>
                                    </View>

                                    <Text style={styles.swipeoutButtonText}
                                          numberOfLines={1}>{isFavorite ? allTranslations(localization.commonUnpin) : allTranslations(localization.commonAnchor)}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }

                    <TouchableOpacity style={styles.swipeoutButton} onPress={handleHideCoupon}>
                        <View style={styles.swipeoutButtonIconContainer}>
                            <Hide/>
                        </View>
                        <Text style={styles.swipeoutButtonText}
                              numberOfLines={1}>{titleButtonHide || allTranslations(localization.commonHide)}</Text>
                    </TouchableOpacity>

                </View>
            </View>

            <View style={styles.coupon}>
                <TouchableOpacity
                    onPress={(!isDisabled && !isNotOpen) ? handleOpenCoupon : null}
                    style={styles.couponContainer}
                    activeOpacity={(!isDisabled && !isNotOpen) ? 0.2 : 1}
                >
                    <View style={[styles.couponLeft, {backgroundColor: colorsPrimary}]}>
                        {
                            isImageCoupon ? (
                                <Image source={{uri: picture}} style={styles.couponImage}/>
                            ) : (
                                <View style={styles.couponLogoContainer}>
                                    <Image source={{uri: organizationLogo}}
                                           style={[styles.couponImage, {borderRadius: 999}]}/>
                                </View>
                            )
                        }
                    </View>
                    <View style={styles.couponBody}>
                        <View style={{flex: 1}}>
                            <Text
                                style={styles.couponTitle}
                                numberOfLines={2}
                            >{name}</Text>
                            <Text
                                style={styles.couponMessage}
                                numberOfLines={isOpenDescription ? 999 : 5}

                                onTextLayout={handleOnDescriptionLayout}
                            >{description}</Text>

                            {
                                isShowButtonOpenDescription && (
                                    <TouchableOpacity onPress={handleOnOpenDescription}>
                                        <Text
                                            style={[styles.buttonOpenDescription, {color: colorsPrimary}]}
                                        >
                                            {(isOpenDescription) ?
                                                allTranslations(localization.commonCollapse) :
                                                allTranslations(localization.commonExpandDescription)
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>

                        {
                            Boolean(props.endDate && !isDisabled) && (
                                <View style={{marginTop: 4}}>
                                    <Text style={styles.dateEndCoupon}>Действует до <Text style={{color: colorsPrimary}}>{moment(props.endDate).format("DD.MM.YYYY")}</Text></Text>
                                </View>
                            )
                        }

                    </View>
                    <View style={styles.couponDash}>
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
                        <Text style={[styles.couponOrganizationName, {color: colorsPrimary}]}>{organizationName}</Text>
                        <Text style={[styles.couponPercent, {color: colorsPrimary}]}>{props.offer.percent}%</Text>
                        <Text style={[styles.couponCashbackText, {color: colorsPrimary}]}>{allTranslations(localization.commonCashback)}</Text>
                        <Text style={[styles.couponPrice, {color: colorsPrimary}]}>{formatMoney(price)} ₽</Text>
                    </View>
                </TouchableOpacity>

                {
                    (isDisabled) && (
                        <View style={styles.containerInfoDisabled}>
                            <Text style={styles.containerInfoDisabledText}>
                                {isOrganizationDisabled ?
                                    allTranslations(localization.componentsCouponOrganizationDisabled) :
                                    isCouponDisabled ?
                                        allTranslations(localization.componentsCouponCouponDisabled) :
                                        allTranslations(localization.componentsCouponCouponOutStock)
                                }
                            </Text>
                        </View>
                    )
                }

            </View>

        </SwipeRow>
    )
};

const styles = StyleSheet.create({
    root: {
        width: '100%',
        position: 'relative',

        marginBottom: 12
    },

    swipeout: {
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },

    coupon: {
        borderRadius: 10,
        overflow: 'hidden'
    },
    couponContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        minHeight: 120,
        overflow: 'hidden'
    },
    couponDisabled: {
        backgroundColor: '#e9e9eb'
    },
    couponLeft: {
        flex: 1,
        maxWidth: '20%',

        backgroundColor: '#294398',

        justifyContent: 'center',
        alignItems: 'center'
    },
    couponBody: {
        flex: 1,

        paddingHorizontal: 10,
        paddingVertical: 12
    },
    couponRight: {
        flex: 1,
        maxWidth: '27%',

        paddingHorizontal: 10,
        paddingVertical: 10
    },
    couponDash: {
        width: 3
    },

    couponLogoContainer: {
        width: 50,
        height: 50,

        borderRadius: 999,

        padding: 3,

        backgroundColor: 'white',

        justifyContent: 'center',
        alignItems: 'center'
    },
    couponLogo: {
        flex: 1
    },

    couponImage: {
        flex: 1,
        width: '100%'
    },

    couponTitle: {
        fontFamily: 'AtypText_semibold',
        fontSize: 14,
        lineHeight: 17,

        marginBottom: 4
    },
    couponMessage: {
        fontFamily: 'AtypText_medium',
        fontSize: 10,
        lineHeight: 11,
        opacity: 0.5,

        marginBottom: 8
    },

    couponOrganizationName: {
        fontFamily: 'AtypText_semibold',
        fontSize: 10,
        lineHeight: 12,
        letterSpacing: -0.2,

        marginBottom: 4
    },
    couponPercent: {
        fontFamily: 'AtypText_bold',
        fontSize: 26,
        lineHeight: 26
    },
    couponCashbackText: {
        fontSize: 9,
        lineHeight: 9,
        fontFamily: 'AtypText_semibold',

        marginBottom: 18
    },
    couponPrice: {
        fontFamily: 'AtypText_semibold',
        fontSize: 14,
        lineHeight: 17
    },

    swipeoutBtnsRight: {
        width: 64,
        paddingLeft: 10,

        justifyContent: 'space-between'
    },

    swipeoutButton: {
        padding: 4,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',

        width: 54,
        height: 54,

        justifyContent: 'center',
        alignItems: 'center'
    },
    swipeoutButtonIconContainer: {
        marginBottom: 6,

        width: 24,
        height: 24
    },
    swipeoutButtonText: {
        fontSize: 9,
        lineHeight: 13,
        color: '#8152E4',
        textAlign: 'center'
    },

    buttonOpenDescription: {
        fontFamily: 'AtypText',
        fontSize: 10,
        lineHeight: 12
    },

    dash: {
        flexDirection: 'column',
        position: 'absolute',
        top: -16,
        bottom: -16
    },

    swipeRowHidden: {
        flexDirection: 'row',
        justifyContent: 'flex-end',

        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,

        backgroundColor: 'rgba(0, 0, 0, 0)'
    },

    containerInfoDisabled: {
        paddingVertical: 8,
        backgroundColor: '#ff6666',
    },
    containerInfoDisabledText: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 20,
        textAlign: 'center',
        color: 'white'
    },

    dateEndCoupon: {
        fontFamily: "AtypText_medium",
        fontSize: 10,
        lineHeight: 12,
        color: "rgba(0,0,0,0.5)"
    }
});

Coupon.defaultProps = {
    favoriteCouponsIds: [],

    onHideCoupon: function () {
    },

    isHideSwipe: false
};

export default Coupon
