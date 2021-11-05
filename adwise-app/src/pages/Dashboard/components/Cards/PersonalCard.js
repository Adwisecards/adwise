import React, {useState, useRef} from 'react';
import {
    View,
    Text,
    Image,
    Easing,
    Animated,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import i18n from "i18n-js";
import {BoxShadow} from 'react-native-shadow'

const {width, height} = Dimensions.get('window');
const widthCard = width - 68;

const facebookWhiteIcon = require('../../../../../assets/graphics/socials/facebook_white.png');
const instagramWhiteIcon = require('../../../../../assets/graphics/socials/instagram_white.png');
const youTubeWhite = require('../../../../../assets/graphics/socials/you_tube_white.png');

const reverseIcon = require('../../../../../assets/graphics/cards/reverse.png');
const sharedIcon = require('../../../../../assets/graphics/cards/shared.png');

const PersonalCard = (props) => {
    const {goToPage} = props;
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
        }, 300);
    }

    const spin = reversCardAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    return (
        <Animated.View
            style={[
                {...styles.root},
                {
                    transform: [
                        {
                            rotateY: spin
                        }
                    ]
                }
            ]}
        >
            {
                (showOtherSide) ? (
                    <View style={styles.rootContainer}>
                        <View>
                            <TouchableOpacity
                                style={styles.buttonReverse}
                                onPress={handleReversCard}
                            >
                                <Image
                                    style={styles.buttonReverseIcon}
                                    source={reverseIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.rootBottom, styles.rootContainerReverse]}>
                            <View style={styles.qrCodeContainer}>
                                <Image
                                    source={{uri: 'https://qrcode.tec-it.com/API/QRCode?data=%d0%93%d0%b5%d0%bd%d0%b5%d1%80%d0%b0%d1%82%d0%be%d1%80+QR-%d0%ba%d0%be%d0%b4%d0%be%d0%b2+%d0%be%d1%82+%d0%ba%d0%be%d0%bc%d0%bf%d0%b0%d0%bd%d0%b8%d0%b8+TEC-IT'}}
                                    style={styles.qrCodeImage}
                                />
                            </View>
                            <TouchableOpacity style={styles.containerButtonShare}>
                                <Image
                                    source={sharedIcon}
                                    style={styles.buttonShareIcon}
                                />
                                <Text style={styles.buttonShareTitle}>{i18n.t('buttons.share')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rootLineBottom}/>
                    </View>
                ) : (
                    <View style={styles.rootContainer} onPress={goToPage}>
                        <View style={styles.rootTop}>
                            <TouchableOpacity onPress={goToPage} style={styles.imageContainer}>
                                <Image
                                    style={styles.image}
                                    source={{uri: 'https://s3-alpha-sig.figma.com/img/9d63/152c/89c597c97b489452874340b81cfe53d4?Expires=1602460800&Signature=M43nOBAkcvrdh--Jf2ncKPxeUOL5fq6Dnh2l2Bpdgytkhfk4HDK6VwmqxY0uGGWmONZNNZP9pMcO~c1BLyoTUcaDR4v~y5~FpBCqNuGrIALL3jZa6DLOKEU5UcBvJlcd3qOOspvEW0-HVCXFsT38M3sxv~MgOKJLiqiU8194AKXavtKblVb0hhwA~Tq3XAZpgI2pgBM6MRaCKqXfDnnCefWRoIZ7wMMXU3h3zdJyVfDjjkZ38pOd~HiWU2m3DNek7DQcJNI0F7L8OroqT06kt5d3DVRm3qMEHWeP84MrPgX1mzH2qUopAnlvGduJtQy2lM6~-nBN9BBGAyKwRuKmEg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'}}
                                />
                            </TouchableOpacity>
                            <View>
                                <View style={{marginBottom: 4, marginTop: 4}}>
                                    <Text style={styles.fontName}>{props.firstName.value}</Text>
                                    <Text style={styles.fontName}>{props.lastName.value}</Text>
                                </View>

                                <Text style={styles.fontProfession}>{props.activity.value}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.buttonReverse}
                                onPress={handleReversCard}
                            >
                                <Image
                                    style={styles.buttonReverseIcon}
                                    source={reverseIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rootBottom}>
                            <View>
                                <Text style={styles.fontContact}>{props.phone.value}</Text>
                                <Text style={styles.fontContact}>{props.email.value}</Text>
                            </View>
                            <View style={styles.socialsList}>
                                {
                                    (props.socialNetworks.fb.value) ? (
                                        <TouchableOpacity style={styles.socialButton}>
                                            <Image
                                                style={styles.socialIcon}
                                                source={facebookWhiteIcon}
                                                resizeMode='contain'
                                            />
                                        </TouchableOpacity>
                                    ) : null
                                }

                                {
                                    (props.socialNetworks.insta.value) ? (
                                        <TouchableOpacity style={styles.socialButton}>
                                            <Image
                                                style={styles.socialIcon}
                                                source={instagramWhiteIcon}
                                                resizeMode='contain'
                                            />
                                        </TouchableOpacity>
                                    ) : null
                                }
                            </View>
                        </View>

                        <View style={styles.rootLineBottom}></View>
                    </View>
                )
            }
        </Animated.View>
    )
}

const styles1 = StyleSheet.create({
    root: {
        position: 'relative',
        zIndex: 1,
        flex: 1,
        marginLeft: 12,

        width: widthCard,
        minHeight: 165
    },
    rootContainer: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        overflow: 'hidden'
    },

    cardFacial: {},
    cardFacialTop: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    cardFacialBottom: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#edf6fe'
    },
    cardFacialImageContainer: {
        width: 70,
        height: 70,
        borderRadius: 10000,
    }
});
const styles = StyleSheet.create({
    root: {
        position: 'relative',
        zIndex: 1,
        flex: 1,
        marginLeft: 12,

        width: widthCard,
        minHeight: 165
    },
    rootContainer: {
        position: 'relative',
        overflow: 'hidden',
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
        backgroundColor: 'white',
        borderRadius: 10,
        flex: 1,
    },
    rootContainerReverse: {
        paddingHorizontal: 14,
        paddingVertical: 14,
        paddingTop: 26,
    },
    rootTop: {
        flexDirection: 'row',
        marginBottom: 24
    },
    rootBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rootLineBottom: {
        position: 'absolute',
        bottom: -7,
        left: 16,
        width: '100%',
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ED9807'
    },

    imageContainer: {
        width: 65,
        height: 65,

        marginRight: 12
    },
    image: {
        flex: 1,
        borderRadius: 999
    },

    fontName: {
        fontFamily: 'AtypText_semibold',
        fontSize: 18,
        lineHeight: 20
    },
    fontProfession: {
        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 14,
        opacity: 0.6
    },
    fontContact: {
        fontSize: 11,
        opacity: 0.5,
        fontFamily: 'AtypText'
    },

    socialsList: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginLeft: -8
    },
    socialButton: {
        justifyContent: 'center',
        alignItems: 'center',

        width: 24,
        height: 24,
        padding: 6,
        marginLeft: 8,
        borderRadius: 999,
        backgroundColor: '#EFA526'
    },
    socialIcon: {
        width: 15,
        height: 15
    },

    rootShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,

        borderRadius: 10,
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: -5,
        zIndex: -10
    },

    buttonReverse: {
        position: 'absolute',
        right: -16,
        top: -12,

        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonReverseIcon: {
        width: 24,
        height: 24
    },

    qrCodeContainer: {
        minWidth: 100,
        minHeight: 100,
        marginRight: 18
    },
    qrCodeImage: {
        flex: 1
    },

    containerButtonShare: {
        height: 100,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F5F5F7',
        borderRadius: 4
    },
    buttonShareIcon: {
        width: 32,
        height: 32,
        marginBottom: 12
    },
    buttonShareTitle: {
        opacity: 0.6,
        fontSize: 12,
        lineHeight: 17,
        textAlign: 'center',
        fontFamily: 'AtypText_medium'
    },
});

export default PersonalCard
