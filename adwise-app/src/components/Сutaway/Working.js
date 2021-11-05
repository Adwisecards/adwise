import React, {useState} from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    StyleSheet,
    TouchableOpacity, Easing, Share
} from "react-native";
import {
    Icon
} from 'native-base';
import {BoxShadow} from "react-native-shadow";
import {hexToRGBA} from "../../helper/converting";
import {
    PersonalSmallCard, СoupArrow as СoupArrowIcon
} from '../../icons';

import IconReversButton from './IconReversButton';
import urls from "../../constants/urls";
import {amplitudeLogEventWithPropertiesAsync} from "../../helper/Amplitude";
import SendShare from "../../helper/Share";
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

const Working = (props) => {
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

    const handleOpenPage = () => {
        props.navigation.navigate('WorkBusinessCard', {
            id: props._id
        })
    }

    const handleSensLinkCard = async () => {
        let message;

        message = allTranslations(localization.commonUserSharedCards, {
            lastName: props.lastName.value,
            firstName: props.firstName.value,
            url: `${ urls["web-site"] }/card/${ props._id }`
        });

        await amplitudeLogEventWithPropertiesAsync('user-shared-cutaway', {
            cutawayId: props._id,
            requestRef: props.requestRef
        });

        await SendShare({
            message
        })
    }

    const showOrganizationImage = !!props.organization.picture;
    const organizationImage = props.organization.picture;

    const showUserImage = !!props.picture.value;
    const userImage = props.picture.value;

    const briefDescription = props.organization.briefDescription;

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

                <View style={styles.cutawayContent}>
                    <View style={[styles.cutawayLeft, { backgroundColor: hexToRGBA(color, 0.1) }]}>
                        <View style={[styles.containerLogosCompany, { borderColor: color }]}>
                            <Image style={{ flex: 1, borderRadius: 999 }} resizeMode={'cover'} source={{ uri: organizationImage }}/>

                            <View style={[styles.containerLogosUser, { borderColor: color, backgroundColor: color }]}>
                                {
                                    showUserImage ? (
                                        <Image style={{ flex: 1 }} resizeMode={'cover'} source={{ uri: userImage }}/>
                                    ) : (
                                        <PersonalSmallCard color={color} width={25} height={25}/>
                                    )
                                }
                            </View>
                        </View>

                        <Text style={styles.typographyCompanyName} numberOfLines={3}>{ briefDescription }</Text>
                    </View>
                    <TouchableOpacity onPress={handleOpenPage} style={styles.cutawayRight}>
                        <View style={{ marginBottom: 4 }}>
                            <Text style={styles.typographyUserName}>{ props.firstName.value }</Text>
                            { !!props.lastName.value && ( <Text style={styles.typographyUserName}>{ props.lastName.value }</Text> ) }
                        </View>

                        <View style={{ marginBottom: 14 }}>
                            <Text style={styles.typographyUserActivity}>{ props.activity.value }</Text>
                        </View>

                        <View style={{ marginBottom: 6 }}>
                            {(!!props.phone.value) && (<Text style={[styles.typographyUserContact, { color: color, fontSize: 12 }]}>{ props.phone.value }</Text>)}
                            {(!!props.email.value) && (<Text style={[styles.typographyUserContact, { color: color }]}>{ props.email.value }</Text>)}
                        </View>

                        <View style={styles.socialList}>
                            <View style={[styles.socialItem, { backgroundColor: color }]}><Icon style={styles.socialItemIcon} name={'facebook'} type={"MaterialCommunityIcons"}/></View>
                            <View style={[styles.socialItem, { backgroundColor: color }]}><Icon style={styles.socialItemIcon} name={'youtube'} type={"MaterialCommunityIcons"}/></View>
                            <View style={[styles.socialItem, { backgroundColor: color }]}><Icon style={styles.socialItemIcon} name={'instagram'} type={"MaterialCommunityIcons"}/></View>
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity style={styles.coupArrowIcon} onPress={handleReversCard}>
                        <IconReversButton color={color}/>
                    </TouchableOpacity>

                    <View style={[styles.cutawayLineFooter, { backgroundColor: color }]}/>
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
                    <TouchableOpacity style={styles.cutawayButtonRevers}>
                        <Image
                            style={styles.cutawayReversQr}
                            resizeMode={'contain'}
                            source={{uri: props.requestRef.QRCode}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cutawayButtonRevers, styles.cutawayButtonReversCenter]} onPress={handleSensLinkCard}>
                        <Icon name={'external-link'} style={[styles.cutawayReversButtonShareIcon, { color: color, fontSize: 34, marginBottom: 6 }]} type={'Feather'}/>
                        <Text style={styles.typographyButtonShare}>{allTranslations(localization.commonShare)}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.coupArrowIcon} onPress={handleReversCard}>
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

    cutawayLeft: {
        width: '40%',

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

        padding: 12,

        marginLeft: 12
    },
    cutawayButtonReversCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    cutawayReversQrContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8
    },
    cutawayReversQr: {
        flex: 1
    },

    containerLogosCompany: {
        position: 'relative',

        width: 70,
        height: 70,
        borderRadius: 999,
        borderWidth: 2,
        borderStyle: 'solid',

        padding: 2,

        backgroundColor: 'white',

        marginBottom: 16
    },
    containerLogosUser: {
        overflow: 'hidden',

        position: 'absolute',
        top: -3,
        right: -3,

        width: 25,
        height: 25,

        borderRadius: 999,

        borderWidth: 1,
        borderStyle: 'solid'
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
        textAlign: 'center'
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
        fontFamily: 'AtypText_medium'
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

    coupArrowIcon: {
        position: 'absolute',
        right: 0,
        top: 0,

    }
});

Working.defaultProps = {
    color: '#6BC20F',
    userColor: '#007BED'
}

export default Working
