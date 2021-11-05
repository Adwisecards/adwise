import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import axios from "../../../../../plugins/axios";
import urls from "../../../../../constants/urls";
import {
    CompanyPageBackground,
    CompanyPageLogo
} from '../../../../../icons';
import {formatMoney} from "../../../../../helper/format";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const {width} = Dimensions.get('window');
const snapToInterval = width * 0.8 - 12;

class ItemShare extends React.PureComponent {

    handleToCoupon = (coupon, invitation) => {


        this.props.navigation.navigate('OpenShareCompany', {
            coupon,
            invitation
        })
    }

    render() {
        const {coupon, color, invitation, isLoading} = this.props;
        const showImage = Boolean(coupon.picture);

        if (coupon.disabled) {
            return null
        }

        return (
            <TouchableOpacity style={styles.root} onPress={() => this.handleToCoupon(coupon, invitation)}>
                <View style={styles.rootLeft}>
                    {
                        showImage ? (
                            <Image
                                style={styles.image}
                                resizeMode={'cover'}
                                source={{uri: coupon.picture}}
                            />
                        ) : (
                            <>
                                <CompanyPageBackground color={this.props.color} style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    right: 0,
                                    bottom: 0
                                }}/>
                                <CompanyPageLogo color={this.props.color}/>
                            </>
                        )
                    }
                </View>
                <View style={styles.rootRight}>
                    <Text style={styles.title} numberOfLines={2}>{coupon.name}</Text>
                    <Text style={[styles.description, {color: this.props.color}]} numberOfLines={3}>{coupon.description}</Text>

                    <View style={{ alignItems: 'flex-start' }}>

                        <Text style={[styles.couponPrice, { color: color }]}>{formatMoney(coupon.price, 2, '.')}₽</Text>

                        <View style={[styles.percentInfo, { backgroundColor: color }]}>
                            <Text style={[styles.percentInfoText, { opacity: 0.6, textTransform: 'uppercase', marginRight: 8 }]}>{allTranslations(localization.companyPagesSuggestions)}</Text>
                            <Text style={[styles.percentInfoText, { fontSize: 12 }]}>
                                { coupon.offer.percent }%
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        position: 'relative',

        overflow: 'hidden',

        marginLeft: 12,
        flexDirection: 'row',
        width: snapToInterval,

        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },

    rootLoading: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },

    rootLeft: {
        width: '33%'
    },
    rootRight: {
        width: '77%',
        padding: 16,
        flex: 1
    },

    image: {
        flex: 1
    },

    percentInfo: {
        flexDirection: 'row',

        marginTop: 8,

        paddingVertical: 4,
        paddingHorizontal: 8,

        borderRadius: 4,

        backgroundColor: '#0085FF'
    },
    percentInfoText: {
        fontSize: 10,
        lineHeight: 13,
        color: 'white'
    },

    couponPrice: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 14,

        marginTop: 8
    },

    title: {
        fontFamily: 'AtypText_semibold',
        fontSize: 16,
        lineHeight: 18,
        flex: 1
    },
    description: {
        flex: 1,
        flexShrink: 1,
        marginTop: 8,
        fontSize: 14,
        lineHeight: 14,
        fontFamily: 'AtypText_medium'
    }
});

export default ItemShare
