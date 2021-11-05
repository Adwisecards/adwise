import React from "react";
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from "react-native";

const CouponLoading = (props) => {
    return (
        <View style={styles.coupon}>
            <View style={[styles.couponLeft]}>
                <View style={styles.couponLogoContainer}/>
            </View>
            <View style={styles.couponBody}>
                <View style={styles.couponTitle}/>

                <View>
                    <View style={styles.couponMessage}/>
                    <View style={styles.couponMessage}/>
                    <View style={[styles.couponMessage, { width: '40%' }]}/>
                </View>
            </View>
            <View style={styles.couponRight}/>
        </View>
    )
};

const styles = StyleSheet.create({
    root: {
        width: '100%',
        position: 'relative',

        marginBottom: 12
    },

    coupon: {
        flexDirection: 'row',

        backgroundColor: '#ffffff',

        borderRadius: 10,

        minHeight: 120,

        overflow: 'hidden'
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

        backgroundColor: '#DCDCDC',

        justifyContent: 'center',
        alignItems: 'center'
    },

    couponImage: {
        flex: 1,
        width: '100%'
    },

    couponTitle: {
        width: '60%',
        height: 17,
        backgroundColor: '#DCDCDC',
        borderRadius: 4,

        marginBottom: 4
    },
    couponMessage: {
        width: '100%',
        height: 12,
        backgroundColor: '#DCDCDC',
        borderRadius: 4,
        marginBottom: 1
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
    }
});

export default CouponLoading
