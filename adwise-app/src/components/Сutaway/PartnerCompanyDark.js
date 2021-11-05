import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Easing,
    Image,
    Text,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import {hexToRGBA} from "../../helper/converting";
import {Icon} from "native-base";
import IconReversButton from "./IconReversButton";
import {BoxShadow} from "react-native-shadow";

import BackgroundCard from './assets/BackgroundPartnerCompany.jpg';
import BackgroundButtonReverse from './assets/buttun_revers_partner_company.png';
import LogoGold from '../../../assets/graphics/logos/logo_gold.png';
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const shadowOpt = {
    color: "#000",
    border: 10,
    radius: 8,
    opacity: 0.15,
    x: 6,
    y: 10
};

const PartnerCompanyDark = (props) => {

    const {widthCard, onOpenShare, notToPage, color, userColor} = props;
    const [showOtherSide, setShowOtherSide] = useState(false);
    const reversCardAnimated = new Animated.Value(0);

    const handleReversCard = () => {
        Animated.timing(
            reversCardAnimated,
            {
                toValue: 1,
                duration: 1200,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start();

        setTimeout(() => {
            setShowOtherSide(!showOtherSide)
        }, 200);
    }

    const spin = reversCardAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    if (!showOtherSide){
        return (
            <Animated.View style={[
                styles.cutaway,
                {
                    transform: [
                        {
                            rotateY: spin
                        }
                    ]
                }
            ]}>

                <ImageBackground style={styles.cutawayContent} source={BackgroundCard} resizeMode={'cover'}>

                    <View style={styles.container}>
                        <View style={styles.cutawayLeft}>
                            <View style={styles.containerLogo}>
                                <Image source={LogoGold} resizeMode={'contain'} style={styles.logoImage}/>
                                <Text style={styles.logoText}>AdWise</Text>
                            </View>
                        </View>
                        <View style={styles.cutawayRight}></View>
                    </View>

                    <TouchableOpacity style={styles.buttonReverse} onPress={handleReversCard}>
                        <Image source={BackgroundButtonReverse} style={{ width: 35, height: 35 }} resizeMode={'contain'}/>
                    </TouchableOpacity>

                    <View style={[styles.cutawayLineFooter, { backgroundColor: color }]}/>
                </ImageBackground>

                <BoxShadow setting={{
                    ...shadowOpt,
                    style: styles.shadow,
                    width: widthCard - 12,
                    height: 150
                }}/>
            </Animated.View>
        )
    }

    return (
        <Animated.View style={[
            styles.cutaway,
            {
                transform: [
                    {
                        rotateY: spin
                    }
                ]
            }
        ]}>

            <View style={[styles.cutawayContent, { backgroundColor: color }]}>

                <View style={styles.containerButtonRevers}>
                    <TouchableOpacity style={styles.cutawayButtonRevers}></TouchableOpacity>
                    <TouchableOpacity style={styles.cutawayButtonRevers}>
                        <Icon name={'external-link'} style={[styles.cutawayReversButtonShareIcon, { color: color, fontSize: 34, marginBottom: 6 }]} type={'Feather'}/>
                        <Text style={styles.typographyButtonShare}>{allTranslations(localization.commonShare)}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.buttonReverse} onPress={handleReversCard}>
                    <IconReversButton color={'white'} iconColor={color}/>
                </TouchableOpacity>
            </View>

            <BoxShadow setting={{
                ...shadowOpt,
                style: styles.shadow,
                width: widthCard - 12,
                height: 150
            }}/>
        </Animated.View>
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
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderRadius: 10,
        overflow: 'hidden'
    },

    cutawayLeft: {},
    cutawayRight: {},

    logoImage: {
        width: 60,
        height: 40,
        marginBottom: 6
    },
    logoText: {
        fontSize: 19,
        lineHeight: 29,
        fontFamily: 'AtypText_semibold',
        color: 'white'
    },

    buttonReverse: {
        width: 35,
        height: 35,
        position: 'absolute',
        right: 0,
        top: 0
    },

    container: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerLogo: {
        marginBottom: 16
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

export default PartnerCompanyDark
