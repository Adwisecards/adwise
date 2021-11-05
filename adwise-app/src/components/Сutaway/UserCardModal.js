import React, {useState} from 'react';
import {
    View,
    Text,
    Image,
    Easing,
    Animated,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    formatPhoneNumber
} from '../../helper/format';
import {
    Icon
} from 'native-base';
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import {generateQrCode} from "../../helper/generateQrCode";
import * as Linking from "expo-linking";
import localization from "../../localization/localization";

const UserCardModal = (props) => {
    const {widthCard, onOpenShare, onClose} = props;
    const [showOtherSide, setShowOtherSide] = useState(false);
    const reversCardAnimated = new Animated.Value(0);

    const color = '#F84E7B';

    const handleCallPhone = () => {
        Linking.openURL(`tel:${props.phone.value}`);
    }
    const handleSendMailto = () => {
        Linking.openURL(`mailto:${props.email.value}`);
    }

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
    const handleShareCard = () => {
        if (onOpenShare){
            onOpenShare({
                _id: props._id,
                firstName: props.firstName
            })
        }
    }

    const handleToPage = () => {
        onClose();

        props.navigation.navigate('CutawayUserInformation', {
            id: props._id
        })
    }

    const handleGenerateQrCode = () => {
        return props.requestRef.QRCode;
    }

    const spin = reversCardAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    if (!showOtherSide) {
        return (
            <Animated.View
                style={[
                    {...styles.cutaway},
                    {
                        transform: [
                            {
                                rotateY: spin
                            }
                        ]
                    }
                ]}
            >
                <View style={styles.cutawayContent}>
                    <TouchableOpacity style={styles.cutawayBody} onPress={handleToPage}>
                        <View style={[styles.cutawayImageContainer, {borderColor: color}, (!props.picture.value) && styles.cutawayImagePlugContainer]}>
                            {
                                props.picture.value ? (
                                    <Image style={styles.cutawayImage} resizeMode={'cover'} source={{uri: props.picture.value}}/>
                                ) : (
                                    <Icon name={'person'} type={'MaterialIcons'} style={[ styles.cutawayImagePlug, { color: color }]}/>
                                )
                            }
                        </View>

                        <View>
                            <Text style={styles.typographyName}>{props.firstName.value}</Text>
                            <Text style={styles.typographyLastName}>{props.lastName.value}</Text>
                            <Text style={styles.typographyActivity}>{props.activity.value}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.cutawayFooter}>
                        <View style={styles.cutawayFooterContent}>
                            <View>
                                {(props.phone.value) ? (
                                    <TouchableOpacity onPress={handleCallPhone}>
                                        <Text
                                            style={[styles.typographyPhone, {color: color}]}
                                        >
                                            {formatPhoneNumber(props.phone.value)}
                                        </Text>
                                    </TouchableOpacity>) : null}
                                {(props.email.value) ? (
                                    <TouchableOpacity onPress={handleSendMailto}>
                                        <Text
                                            style={[styles.typographyEmail, {color: color}]}
                                        >
                                            {props.email.value}
                                        </Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>

                            <View style={styles.cutawaySocialContainer}>
                                <TouchableOpacity style={[styles.cutawaySocialButton, {backgroundColor: color}]}>
                                    <Icon name={'facebook'} style={styles.cutawaySocialIcon}
                                          type={'MaterialCommunityIcons'}/>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.cutawaySocialButton, {backgroundColor: color}]}>
                                    <Icon name={'youtube'} style={styles.cutawaySocialIcon}
                                          type={'MaterialCommunityIcons'}/>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.cutawaySocialButton, {backgroundColor: color}]}>
                                    <Icon name={'instagram'} style={styles.cutawaySocialIcon}
                                          type={'MaterialCommunityIcons'}/>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[styles.cutawayFooterLine, {backgroundColor: color}]}/>
                        <View style={[styles.cutawayFooterBackground, {backgroundColor: color}]}/>
                    </View>

                    {/*<TouchableOpacity style={[styles.cutawayButtonReverse, {backgroundColor: color}]}*/}
                    {/*                  onPress={handleReversCard}>*/}
                    {/*    <Icon style={styles.cutawayButtonReverseIcon} name={'corner-up-left'} type={'Feather'}/>*/}

                    {/*    <View style={styles.cutawayButtonReverseLine}/>*/}
                    {/*</TouchableOpacity>*/}
                </View>
            </Animated.View>
        )
    }

    return (
        <Animated.View
            style={[
                {...styles.cutaway},
                {
                    transform: [
                        {
                            rotateY: spin
                        }
                    ]
                }
            ]}
        >
            <View style={[styles.cutawayReversContent, {backgroundColor: color}]}>
                <TouchableOpacity style={styles.cutawayReversQrContainer} onPress={handleShareCard}>
                    <Image
                        style={styles.cutawayReversQr}
                        resizeMode={'contain'}
                        source={{uri: handleGenerateQrCode()}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cutawayReversButtonShare} >
                    <Icon name={'external-link'} style={[styles.cutawayReversButtonShareIcon, { color: color }]} type={'Feather'}/>
                    <Text style={styles.cutawayReversButtonShareText}>{allTranslations(localization.commonShare)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.cutawayButtonReverse, styles.cutawayReversButtonReverse, {borderColor: color}]}
                    onPress={handleReversCard}>
                    <Icon style={[styles.cutawayButtonReverseIcon, {color: color}]} name={'corner-up-left'}
                          type={'Feather'}/>

                    <View style={[styles.cutawayButtonReverseLine, {backgroundColor: color}]}/>
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    cutaway: {
        flex: 1,
        position: 'relative',
    },
    cutawayContent: {
        height: 165,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden'
    },

    cutawayBody: {
        padding: 18,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    cutawayFooter: {
        paddingVertical: 16,
        paddingHorizontal: 18,
        position: 'relative',
        zIndex: 1,
        flex: 1,
    },
    cutawayFooterContent: {
        zIndex: 1,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
    },
    cutawayFooterBackground: {
        zIndex: -1,
        opacity: 0.07,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    },
    cutawayFooterLine: {
        position: 'absolute',
        left: 18,
        right: 18,
        bottom: -7,
        borderRadius: 3,
        height: 10
    },

    cutawayImageContainer: {
        marginRight: 12,
        width: 70,
        height: 70,
        borderRadius: 999,
        position: 'relative',
        overflow: 'hidden',
        borderStyle: 'solid',
        borderWidth: 2
    },
    cutawayImage: {
        flex: 1,
        marginTop: -10,
        marginBottom: -10,
        marginLeft: -10,
        marginRight: -10
    },
    cutawayImagePlug: {
        fontSize: 40
    },
    cutawayImagePlugContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    cutawaySocialContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -6
    },
    cutawaySocialButton: {
        width: 24,
        height: 24,
        borderRadius: 999,
        marginLeft: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cutawaySocialIcon: {
        fontSize: 15,
        color: 'white'
    },

    typographyName: {
        fontFamily: 'AtypText_medium',
        fontSize: 17,
        lineHeight: 19
    },
    typographyLastName: {
        fontFamily: 'AtypText_medium',
        fontSize: 17,
        lineHeight: 19,

        marginBottom: 4
    },
    typographyActivity: {
        fontFamily: 'AtypText',
        fontSize: 11,
        lineHeight: 13,
        opacity: 0.6
    },
    typographyPhone: {
        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 14
    },
    typographyEmail: {
        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 14,
    },

    cutawayButtonReverse: {
        width: 34,
        height: 34,
        position: 'absolute',
        zIndex: 999,
        top: 0,
        right: 0,
        padding: 3,
        alignItems: 'flex-end',
        overflow: 'hidden'
    },
    cutawayButtonReverseLine: {
        position: 'absolute',
        left: -24,
        bottom: -16,
        backgroundColor: 'white',
        width: 75,
        height: 30,

        transform: [
            {rotate: '45deg'}
        ]
    },
    cutawayButtonReverseIcon: {
        color: 'white',
        opacity: 0.5,
        fontSize: 18
    },

    shadow: {
        position: 'absolute',
        zIndex: -999
    },

    cutawayReversContent: {
        padding: 24,
        flexDirection: 'row',
        height: 165,
        borderRadius: 10,
        overflow: 'hidden'
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
    cutawayReversButtonShare: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginLeft: 12
    },
    cutawayReversButtonShareIcon: {
        fontSize: 34,
        marginBottom: 6
    },
    cutawayReversButtonShareText: {
        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 17,
        opacity: 0.6,
        textAlign: 'center'
    },
    cutawayReversButtonReverse: {
        backgroundColor: 'white',
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomLeftRadius: 100
    }
});

export default UserCardModal
