import React, {PureComponent} from "react";
import {
    View,
    Text,
    Image,
    Animated,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Easing,
    TouchableNativeFeedback,
    Platform, Share
} from "react-native";
import {
    СoupArrow as СoupArrowIcon,
    IconVk as IconVkIcon,
    IconFaceBook as IconFaceBookIcon,
    IconInstagram as IconInstagramIcon
} from "../../../icons";
import {
    Icon,
} from "native-base";

import * as Linking from "expo-linking";
import {amplitudeLogEventWithPropertiesAsync} from "../../../helper/Amplitude";
import urls from "../../../constants/urls";
import SendShare from "../../../helper/Share";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class BusinessCardsWork extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            orientation: [1, 0],
            spin: 0,
            color: props.color,
            colorOrganization: props?.organization?.colors?.primary,
            isUserImage: Boolean(props?.picture?.value) || false,
            isOrganizationImage: Boolean(props?.organization?.picture) || false,
        };

        this.spin = new Animated.Value(0);
    }

    onOpenSocial = (social) => {
        Linking.openURL(social);
    }

    onReverseCard = () => {
        const orientation = [...this.state.orientation];
        const toValue = Number(orientation[0]);

        Animated.timing(
            this.spin,
            {
                toValue: toValue,
                duration: 600,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start();

        setTimeout(() => {
            this.setState({
                orientation: [!orientation[0], !orientation[1]]
            })
        }, 300)
    }

    onOpenQrCode = async () => {
        const props = this.props;

        await amplitudeLogEventWithPropertiesAsync('user-shared-cutaway', {
            cutawayId: props._id,
            requestRef: props.requestRef
        });

        props.onOpenShare({
            _id: props._id,
            lastName: props.lastName,
            firstName: props.firstName,
            picture: props.picture,
            activity: props.activity,
            color: props.color,
            requestRef: props.requestRef
        })
    }
    onShare = async () => {
        const props = this.props;
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

        await SendShare({ message })
    }

    _routePage = () => {
        const props = this.props;

        props.navigation.navigate('WorkBusinessCard', {
            id: props._id
        })
    }

    render() {
        const {
            organization,
            firstName,
            lastName,
            activity,
            phone,
            email,
            picture: userPicture,
            requestRef
        } = this.props;
        const {color, colorOrganization, orientation, isUserImage, isOrganizationImage} = this.state;

        const isIos = Platform.OS === 'ios';
        const ButtonComponent = isIos ? TouchableOpacity : TouchableNativeFeedback;
        const socialNetworks = organization.socialNetworks;
        const rotateY = this.spin.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
        });

        return (
            <Animated.View
                style={[
                    styles.root,
                    {transform: [{rotateY: rotateY}]}
                ]}
            >

                {(Boolean(orientation[0])) && (
                    <View style={[styles.container, styles.containerFront]}>

                        <TouchableOpacity style={styles.containerFrontLeft} onPress={this._routePage}>

                            <View style={[styles.logoContainer, { borderColor: colorOrganization }]}>
                                { isOrganizationImage ? (
                                    <Image style={styles.logoContainerImage} source={{ uri: organization?.picture }}/>
                                ) : (
                                    null
                                )}

                                <View style={[styles.logoContainerUser, { borderColor: color }]}>
                                    {isUserImage ? (
                                        <Image style={styles.logoContainerUserImage} source={{ uri: userPicture?.value }}/>
                                    ) : (
                                        null
                                    )}
                                </View>

                            </View>

                            <Text style={styles.organizationName} numberOfLines={3}>{ organization?.name }</Text>

                            <View style={[styles.containerFrontLeftBackground, { backgroundColor: colorOrganization }]}/>
                        </TouchableOpacity>

                        <View style={styles.containerFrontRight}>
                            <View style={{ marginBottom: 4 }}>
                                <Text style={styles.userName}>{ firstName?.value }</Text>
                                {(Boolean(lastName?.value)) && (
                                    <Text style={styles.userName}>{ lastName?.value }</Text>
                                )}
                            </View>

                            <View style={{ marginBottom: 14 }}>
                                <Text style={styles.userRole}>{ activity?.value || '' }</Text>
                            </View>
                            <View style={{ marginBottom: 6 }}>
                                {Boolean(phone?.value) && (<Text style={[styles.userPhone, { color: color }]}>{ phone?.value }</Text>)}
                                {Boolean(email?.value) && (<Text style={[styles.userEmail, { color: color }]}>{ email?.value }</Text>)}
                            </View>

                            <View style={styles.socials}>
                                { Boolean(socialNetworks?.vk) && (
                                    <TouchableOpacity style={[styles.social, { backgroundColor: colorOrganization }]} onPress={() => this.onOpenSocial(socialNetworks?.vk)}>
                                        <IconVkIcon color="white"/>
                                    </TouchableOpacity>
                                )}
                                { Boolean(socialNetworks?.insta) && (
                                    <TouchableOpacity style={[styles.social, { backgroundColor: colorOrganization }]} onPress={() => this.onOpenSocial(socialNetworks?.vk)}>
                                        <IconInstagramIcon color="white"/>
                                    </TouchableOpacity>
                                )}
                                { Boolean(socialNetworks?.fb) && (
                                    <TouchableOpacity style={[styles.social, { backgroundColor: colorOrganization }]} onPress={() => this.onOpenSocial(socialNetworks?.vk)}>
                                            <IconFaceBookIcon color="white"/>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                    </View>
                )}
                {(Boolean(orientation[1])) && (
                    <View style={[styles.container, styles.containerBack, { backgroundColor: colorOrganization }]}>

                        <View style={styles.containerButtonBack}>
                            <ButtonComponent onPress={this.onOpenQrCode} style={{flex: 1}}>
                                <View style={styles.buttonBack}>
                                    <Image
                                        source={{ uri: requestRef.QRCode }}
                                        style={{ flex: 1, margin: 12 }}
                                        resizeMode="contain"
                                    />
                                </View>
                            </ButtonComponent>
                        </View>

                        <View style={styles.containerButtonBack}>
                            <ButtonComponent onPress={this.onShare} style={{flex: 1}}>
                                <View style={[styles.buttonBack, { justifyContent: 'center', alignItems: 'center' }]}>
                                    <Icon type="Feather" name="external-link" style={{ fontSize: 40, color: colorOrganization }}/>
                                    <Text style={styles.buttonBackText}>{allTranslations(localization.companyPagesShare)}</Text>
                                </View>
                            </ButtonComponent>
                        </View>

                    </View>
                )}

                <TouchableOpacity style={[styles.buttonRevers, Boolean(orientation[1]) && styles.buttonReversBack]} onPress={this.onReverseCard}>
                    <СoupArrowIcon color={orientation[1] ? "white" : colorOrganization} colorArrow={orientation[0] ? "white" : colorOrganization}/>
                </TouchableOpacity>

                <View style={[styles.cardArrowBottom, { backgroundColor: colorOrganization }]}/>

            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'white',
        borderRadius: 10,

        height: 165
    },

    container: {
        flex: 1
    },
    containerFront: {
        flexDirection: 'row'
    },
    containerBack: {
        padding: 24,
        flexDirection: 'row',
        marginRight: -10,
        transform: [{rotateY: '-180deg'}]
    },

    containerFrontLeft: {
        width: 120,
        position: 'relative',
        overflow: 'hidden',

        justifyContent: 'center',
        alignItems: 'center'
    },
    containerFrontLeftBackground: {
        position: 'absolute',
        left: -50,
        top: -50,
        right: -50,
        bottom: -50,
        opacity: 0.1,
        zIndex: -1
    },
    containerFrontRight: {
        paddingTop: 24,
        paddingHorizontal: 16,
        paddingBottom: 8,
    },

    logoContainer: {
        backgroundColor: 'white',

        width: 70,
        height: 70,

        borderRadius: 999,
        borderWidth: 2,
        borderStyle: 'solid',

        marginBottom: 16
    },
    logoContainerImage: {
        flex: 1,
        borderRadius: 999
    },
    logoContainerUser: {
        width: 30,
        height: 30,

        position: 'absolute',
        top: -6,
        right: -6,
        zIndex: 2,

        borderRadius: 999,
        borderWidth: 1.5,
        borderStyle: 'solid',
        backgroundColor: 'white'
    },
    logoContainerUserImage: {
        flex: 1,
        borderRadius: 999
    },

    organizationName: {
        fontFamily: 'AtypText_semibold',
        fontSize: 14,
        lineHeight: 16,
        textAlign: 'center',
        maxWidth: 100
    },

    socials: {
        flex: 1,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginLeft: -8,
    },
    social: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,

        padding: 6,

        marginLeft: 8
    },

    cardArrowBottom: {
        height: 10,
        borderRadius: 999,

        position: 'absolute',
        left: 16,
        right: 16,
        bottom: -7
    },

    containerButtonBack: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: 'white',
        borderRadius: 8
    },
    buttonBack: {
        flex: 1
    },
    buttonBackText: {
        marginTop: 8,

        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 17,
        color: 'black',
        opacity: 0.6
    },

    userName: {
        fontSize: 17,
        lineHeight: 19,
        color: 'black',
        fontFamily: 'AtypText_medium'
    },
    userRole: {
        fontFamily: 'AtypText',
        fontSize: 12,
        lineHeight: 14,
        opacity: 0.6,
        color: 'black'
    },
    userPhone: {
        fontSize: 12,
        lineHeight: 14,
        fontFamily: 'AtypText_medium'
    },
    userEmail: {
        fontSize: 10,
        lineHeight: 14,
        fontFamily: 'AtypText_medium'
    },

    buttonRevers: {
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 20
    },
    buttonReversBack: {
        right: null,
        left: 0,
        transform: [{rotateY: '-180deg'}]
    },
});

export default BusinessCardsWork
