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
import i18n from 'i18n-js';

const {width} = Dimensions.get('window');
const widthCard = width - 68;

const facebookWhiteIcon = require('../../../../../assets/graphics/socials/facebook_white.png');
const instagramWhiteIcon = require('../../../../../assets/graphics/socials/instagram_white.png');
const youTubeWhite = require('../../../../../assets/graphics/socials/you_tube_white.png');

const reverseIcon = require('../../../../../assets/graphics/cards/reverse.png');
const sharedIcon = require('../../../../../assets/graphics/cards/shared.png');

const WordCard = (props) => {
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
                        <View style={[styles.rootContainerReverse]}>
                            <View style={styles.qrCodeContainer}>
                                <Image
                                    source={{ uri: 'https://qrcode.tec-it.com/API/QRCode?data=%d0%93%d0%b5%d0%bd%d0%b5%d1%80%d0%b0%d1%82%d0%be%d1%80+QR-%d0%ba%d0%be%d0%b4%d0%be%d0%b2+%d0%be%d1%82+%d0%ba%d0%be%d0%bc%d0%bf%d0%b0%d0%bd%d0%b8%d0%b8+TEC-IT' }}
                                    style={styles.qrCodeImage}
                                />
                            </View>
                            <TouchableOpacity style={styles.containerButtonShare}>
                                <Image
                                    source={sharedIcon}
                                    style={styles.buttonShareIcon}
                                />
                                <Text style={styles.buttonShareTitle}>{ i18n.t('buttons.share') }</Text>
                            </TouchableOpacity>
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
                ) : (
                    <View style={styles.rootContainer}>
                        <View style={styles.rootLeft}>
                            <View style={styles.imageContainer}>
                                <Image
                                    style={styles.image}
                                    source={{uri: 'https://s3-alpha-sig.figma.com/img/08b1/50aa/98d80aa539bfcb12bdc8c8ffc14a3f2d?Expires=1602460800&Signature=WVK39wjJ8XNjGyNyHncDZH5XFLkHAargy0sFKmij2RbVBVGD4NVrN3Iw3QFd4-XUEwBbLtqjpuq-qqEoVIYiXY71~5X3xhz-t3y2JLt3hhVqw5MbxOG~0mRlWmNSpcda6WSHaBssFTScBnJSvZfUiu0aUc5hNv0~nZzQnyIuoBa2SY-Fd2xVodzAMLKF-b1yYcqkN6BiP1bJIJf7u53i9U0UbuSXHgasguDSUmFcyyzucoKOW7jpljIZ48oTFE4-MLzWyh2ZGaTmOHKvtjN8w~Iow9fBPydSJLZ~-PjsJ0dzPq3OE905wBgvOGLn4RuWOrGL7MpA891U2hM65XqyvQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'}}
                                />
                            </View>

                            <Text style={styles.workTitle}>Компания</Text>
                            <Text style={styles.workTitle}>Ситис</Text>
                        </View>
                        <View style={styles.rootRight}>
                            <View style={{ marginBottom: 16 }}>
                                <View style={{marginBottom: 4, marginTop: 4}}>
                                    <Text style={styles.fontName}>Кирилл</Text>
                                    <Text style={styles.fontName}>Молчанов</Text>
                                </View>
                                <Text style={styles.fontProfession}>Дизайнер</Text>
                            </View>

                            <View>
                                <Text style={styles.fontContact}>7 902 277-41-14</Text>
                                <Text style={styles.fontContact}>Molchanov@gmail.com</Text>
                                <Text style={styles.fontContact}>Molchanov.com</Text>
                            </View>
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
                )
            }
        </Animated.View>
    )
}

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
        flexDirection: 'row',
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
        flexDirection: 'row',
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 14,
        paddingTop: 26,
    },
    rootTop: {
        flexDirection: 'row',
        marginBottom: 24
    },
    rootLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        backgroundColor: '#92CF37',
        marginLeft: -16,
        marginTop: -12,
        marginBottom: -12,
        marginRight: 12
    },
    rootRight: {},
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

        marginBottom: 12
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
        right: 0,
        top: 0,

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

    workTitle: {
        fontFamily: 'AtypText_semibold',
        fontSize: 12,
        lineHeight: 13,
        color: 'white',
        fontWeight: '600',
        textAlign: 'center'
    }
});

export default WordCard
