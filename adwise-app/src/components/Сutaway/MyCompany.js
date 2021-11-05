import React, {useState} from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    StyleSheet,
    TouchableOpacity, Easing
} from "react-native";
import {
    Icon
} from 'native-base';
import {BoxShadow} from "react-native-shadow";
import {hexToRGBA} from "../../helper/converting";

import IconReversButton from './IconReversButton';
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

const MyCompany = (props) => {
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

    if (!showOtherSide) {
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

                <View style={[styles.cutawayContent, {backgroundColor: color}]}>

                    <View style={styles.containerCutaway}>
                        <View style={styles.cutawayTop}>
                            <View style={styles.containerLogo}></View>

                            <View style={{ flex: 1 }}>
                                <View style={{ marginBottom: 4 }}><Text style={styles.typographyCompanyName}>Ситис</Text></View>
                                <View>
                                    <Text style={styles.typographyCompanyDescription}>Компания «Ситис» успешно работает на рынке предоставления IT-услуг с 2010 года</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.cutawayBottom}>
                            <View>
                                <Text style={styles.typographyContact}>sitisit.ru</Text>
                                <Text style={styles.typographyContact}>7 343 385-22-22</Text>
                                <Text style={styles.typographyContact}>info@sitisit.ru</Text>
                            </View>

                            <View style={styles.socialsList}>
                                <View style={[styles.socialItem, { backgroundColor: color }]}><Icon style={styles.socialItemIcon} name={'facebook'} type={"MaterialCommunityIcons"}/></View>
                                <View style={[styles.socialItem, { backgroundColor: color }]}><Icon style={styles.socialItemIcon} name={'youtube'} type={"MaterialCommunityIcons"}/></View>
                                <View style={[styles.socialItem, { backgroundColor: color }]}><Icon style={styles.socialItemIcon} name={'instagram'} type={"MaterialCommunityIcons"}/></View>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.buttonReverse} onPress={handleReversCard}>
                        <IconReversButton color={'#569b0b'} iconColor={'white'}/>
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
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden'
    },

    buttonReverse: {
        width: 35,
        height: 35,
        position: 'absolute',
        right: 0,
        top: 0
    },

    cutawayTop: {
        flexDirection: 'row',
        flex: 1,
        flexShrink: 1,
        alignItems: 'center',
        paddingHorizontal: 20
    },
    cutawayBottom: {
        borderRadius: 8,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',

        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    socialsList: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -12
    },
    socialItem: {
        width: 24,
        height: 24,

        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 999,
        marginLeft: 12
    },
    socialItemIcon: {
        color: 'white',
        fontSize: 16
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

    containerCutaway: {
        padding: 6,
        flex: 1
    },
    containerLogo: {
        width: 70,
        height: 70,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.1)',

        borderRadius: 999,
        backgroundColor: 'white',

        marginRight: 20
    },
    containerButtonRevers: {
        flex: 1,
        paddingHorizontal: 24,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -12
    },

    typographyContact: {
        fontSize: 9,
        lineHeight: 11,
        letterSpacing: 0.03,
        textTransform: 'uppercase',
        color: 'white',
        opacity: 0.8,
        fontFamily: 'AtypText_medium'
    },
    typographyCompanyName: {
        flexShrink: 1,

        fontFamily: 'AtypText_semibold',
        fontSize: 16,
        lineHeight: 19,
        color: 'white'
    },
    typographyCompanyDescription: {
        flexShrink: 1,

        fontSize: 10,
        lineHeight: 12,
        color: 'white',
        opacity: 0.8,
        fontFamily: 'AtypText_medium'
    },

    shadow: {
        position: 'absolute',
        zIndex: -999
    },
});

MyCompany.defaultProps = {
    color: '#6BC20F',
    userColor: '#007BED'
}

export default MyCompany
