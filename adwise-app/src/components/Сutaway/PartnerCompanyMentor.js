import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Easing
} from "react-native";
import {
    Icon
} from 'native-base';
import {BoxShadow} from "react-native-shadow";
import {hexToRGBA} from "../../helper/converting";

import IconReversButton from './IconReversButton';

import backgroundPartnerCompanyMentor from './assets/background_partner_company_mentor.png';
import logoWhite from '../../../assets/graphics/logos/logo_white.png';
import {formatPhoneNumber} from "../../helper/format";
import localization from "../../localization/localization";
import allTranslations from "../../localization/allTranslations";

const shadowOpt = {
    color: "#000",
    border: 10,
    radius: 8,
    opacity: 0.15,
    x: 6,
    y: 10
};

const PartnerCompanyMentor = (props) => {
    const {mentor, widthCard, color} = props;

    return (
        <View style={styles.cutaway}>
            <View style={styles.cutawayContent}>
                <ImageBackground
                    style={[styles.cutawayLeft, { backgroundColor: hexToRGBA(color, 0.1) }]}
                    resizeMode={'cover'}
                    source={backgroundPartnerCompanyMentor}
                >
                    <View style={[styles.containerLogosCompany]}>
                        <Image style={{ width: 70, height: 70 }} resizeMode={'contain'} source={logoWhite}/>
                    </View>

                    <Text style={styles.typographyCompanyName}>{allTranslations(localization.componentsCutawayPartnerCompany)}</Text>
                </ImageBackground>
                <View style={styles.cutawayRight}>
                    <View style={{ marginBottom: 14 }}>
                        <Text style={styles.typographyUserName}>{mentor?.firstName || ''}</Text>
                        <Text style={styles.typographyUserName}>{mentor?.lastName || ''}</Text>
                    </View>

                    <View style={{ marginBottom: 6 }}>
                        <Text style={[styles.typographyUserContact, { fontSize: 12 }]}>{formatPhoneNumber(mentor.phone)}</Text>
                        <Text style={[styles.typographyUserContact]}>{ mentor?.emailInfo || '' }</Text>
                    </View>
                </View>
                <View style={[styles.cutawayLineFooter, { backgroundColor: '#ED8E00' }]}/>
            </View>

            <BoxShadow setting={{
                ...shadowOpt,
                style: styles.shadow,
                width: widthCard - 12,
                height: 150
            }}/>
        </View>
    )
}

const styles = StyleSheet.create({
    cutaway: {
        flex: 1,
        position: 'relative',
    },
    cutawayContent: {
        flexDirection: 'row',

        height: 165,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden'
    },

    cutawayLeft: {
        width: '50%',

        paddingTop: 16,

        justifyContent: 'center',
        alignItems: 'center',

        paddingHorizontal: 12
    },
    cutawayRight: {
        flex: 1,

        justifyContent: 'center',

        paddingVertical: 12,
        paddingHorizontal: 16
    },

    socialList: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -8
    },
    socialItem: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,

        borderRadius: 999
    },
    socialItemIcon: {
        color: 'white',
        fontSize: 14
    },

    buttonReverse: {
        width: 35,
        height: 35,
        position: 'absolute',
        right: 0,
        top: 0
    },

    cutawayButtonRevers: {
        height: 116,
        flex: 1,
        backgroundColor: '#F5F5F7',
        borderRadius: 8,

        marginLeft: 12,

        justifyContent: 'center',
        alignItems: 'center'
    },

    containerLogosCompany: {
        position: 'relative',

        width: 70,
        height: 70,

        marginBottom: 14
    },
    containerButtonRevers: {
        flex: 1,
        paddingHorizontal: 24,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -12
    },

    typographyCompanyName: {
        fontFamily: 'AtypText_semibold',
        fontSize: 10,
        lineHeight: 12,
        textAlign: 'center',
        color: '#ED8E00'
    },
    typographyUserName: {
        fontFamily: 'AtypText_medium',
        fontSize: 17,
        lineHeight: 19
    },
    typographyUserActivity: {
        opacity: 0.6,
        fontSize: 12,
        lineHeight: 14,
        fontFamily: 'AtypText'
    },
    typographyUserContact: {
        fontSize: 10,
        lineHeight: 14,
        color: '#8152E4',
        fontFamily: 'AtypText'
    },
    typographyButtonShare: {
        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 17,
        opacity: 0.6,
        textAlign: 'center'
    },

    cutawayLineFooter: {
        borderTopRightRadius: 2,
        borderTopLeftRadius: 2,

        height: 3,

        position: 'absolute',
        left: 18,
        right: 18,
        bottom: 0
    },

    shadow: {
        position: 'absolute',
        zIndex: -999
    },
});

PartnerCompanyMentor.defaultProps = {
    color: '#ED8E00'
}

export default PartnerCompanyMentor
