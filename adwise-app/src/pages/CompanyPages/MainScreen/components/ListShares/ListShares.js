import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import ItemShare from './ItemShare';
import ItemShareLoading from './ItemShareLoading';
import {Icon} from "native-base";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const {width} = Dimensions.get('window');
const snapToInterval = width * 0.8;

const ListShares = (props) => {
    const {color, coupons, invitation, isLoading, countCoupons, organization, onOpenCreateMultiplePurchase} = props;

    if (!isLoading && coupons.length <= 0) {
        return null
    }

    const handleToAllCoupons = () => {
        props.navigation.navigate('OrganizationAllCoupons')
    }

    return (
        <View style={styles.root}>

            <TouchableOpacity style={styles.header} onPress={handleToAllCoupons}>
                <Text style={styles.headerTitle}>{allTranslations(localization.companyPagesSuggestions)} <Text style={{ color: props.color }}>{ countCoupons }</Text></Text>

                <Icon style={[styles.sectionArrow, { color: props.color }]} name={'arrow-forward'} type={'MaterialIcons'}/>
            </TouchableOpacity>

            <ScrollView
                style={{marginHorizontal: -12}}
                contentContainerStyle={{paddingRight: 12}}
                snapToInterval={snapToInterval}
                bounces={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}

                decelerationRate={5}
                scrollEventThrottle={10}

                horizontal
                pagingEnabled
                disableIntervalMomentum
            >
                {
                    (isLoading) && (
                        <>
                            <ItemShareLoading/>
                            <ItemShareLoading/>
                            <ItemShareLoading/>
                        </>
                    )
                }

                {
                    coupons.map((coupon, idx) => (
                        <ItemShare
                            coupon={coupon}
                            couponId={coupon}
                            color={color}
                            invitation={invitation}
                            {...props}
                        />
                    ))
                }

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        marginBottom: 24
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 8
    },
    headerTitle: {
        fontSize: 18,
        lineHeight: 18,
        fontFamily: 'AtypText'
    },
    headerArrow: {},
    sectionButtonArrow: {},
    sectionArrow: {
        fontSize: 20
    },
});

export default ListShares
