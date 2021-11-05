import React from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    CompanyPageLogo,
    CompanyPageBackground
} from '../../../../icons';
import {BlurView} from "expo-blur";
import {Icon} from "native-base";
import getHeightStatusBar from "../../../../helper/getHeightStatusBar";
import {hexToRGBA} from "../../../../helper/converting";

const statusBarHeight = getHeightStatusBar();

const Header = (props) => {
    const {
        headerBackgroundColor, headerImageOpacity, headerHeight,
        headerBigLogoOpacity, color, organization, showButtonBack,
        isDisabled
    } = props;

    const showBackground = organization && !!organization.mainPicture;
    const showLogo = organization && !!organization.picture;
    const name = organization?.name;

    const opacityOrganizationName = headerImageOpacity.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [1, 0, 0]
    })
    const opacityOrganizationLogo = headerImageOpacity.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [0, 0, 1]
    })

    const _goBack = () => {
        props.navigation.goBack();
    }

    return (
        <View style={{height: 100, position: 'relative'}}>
            <Animated.View style={[styles.root, {
                backgroundColor: headerBackgroundColor,
                height: headerHeight,
                paddingTop: statusBarHeight
            }]}>
                <Animated.View style={[styles.logoContainer, {width: headerBigLogoOpacity, height: headerBigLogoOpacity, opacity: opacityOrganizationLogo}]}>
                    {
                        showLogo ? (
                            <View style={{flex: 1}}>
                                <Image
                                    style={styles.imageLogo}
                                    resizeMode={'cover'}
                                    source={{uri: organization.picture}}
                                />
                            </View>
                        ) : (
                            <CompanyPageLogo color={!isDisabled ? color : '#DADADA'}/>
                        )
                    }
                </Animated.View>

                {
                    showBackground ? (
                        <Animated.Image
                            style={styles.backgroundImage}
                            resizeMode={'cover'}
                            source={{uri: organization.mainPicture}}
                        />
                    ) : (
                        <Animated.View style={[styles.headerPug, {opacity: headerImageOpacity}]}>
                            <CompanyPageBackground color={!isDisabled ? color : '#DADADA'}/>
                        </Animated.View>
                    )
                }

                <Animated.View style={[styles.organizationNameContainer, {
                    left: headerBigLogoOpacity,
                    opacity: opacityOrganizationName,
                    height: headerHeight
                }]}>
                    <Text style={styles.organizationName} numberOfLines={2}>
                        { name }
                    </Text>
                </Animated.View>

                <Animated.View style={[styles.logoContainerAnimation, {opacity: opacityOrganizationName, height: headerHeight}]}>

                    <TouchableOpacity style={styles.buttonBack} onPress={_goBack}>
                        <Icon name="arrow-left" type="Feather" style={{color: "white"}}/>
                    </TouchableOpacity>

                    <Animated.View style={{width: headerBigLogoOpacity, height: headerBigLogoOpacity}}>
                        {
                            showLogo ? (
                                <View style={{flex: 1}}>
                                    <Image
                                        style={styles.imageLogo}
                                        resizeMode={'cover'}
                                        source={{uri: organization.picture}}
                                    />
                                </View>
                            ) : (
                                <CompanyPageLogo color={!isDisabled ? color : '#DADADA'}/>
                            )
                        }
                    </Animated.View>
                </Animated.View>


                <Animated.View style={[styles.headerAbsoluteBackground, {opacity: opacityOrganizationName}]}>
                    <Image
                        source={require("../../../../../assets/images/organization/header_blur.png")}
                        style={{flex: 1, opacity: 0.6}}
                        resizeMode="cover"
                    />
                    <View style={[styles.headerAbsoluteBackground, {backgroundColor: hexToRGBA(color, 0.8)}]}/>
                </Animated.View>

            </Animated.View>

            {
                showButtonBack && (
                    <TouchableOpacity style={styles.buttonShare} onPress={() => {
                        props.navigation.goBack()
                    }}>
                        <Icon type={"MaterialIcons"} name={"keyboard-backspace"}
                              style={{fontSize: 30, color: '#8152E4'}}/>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    logoContainer: {
        position: 'relative'
    },

    root: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
    backgroundImage: {
        position: 'absolute',
        left: -20,
        top: 0,
        right: -20,
        bottom: 0,
        zIndex: -1,
    },
    imageLogo: {
        flex: 1,
        borderRadius: 999
    },
    headerPug: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: -1
    },
    buttonShare: {
        position: 'absolute',
        left: 12,
        top: 36,
        zIndex: 10,
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 999,

        justifyContent: 'center',
        alignItems: 'center'
    },

    logoContainerAnimation: {
        top: 12,
        left: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 12,
    },
    organizationNameContainer: {
        zIndex: 12,
        justifyContent: 'center',
        top: 12,
        position: 'absolute',
        paddingLeft: 12,
        marginLeft: 56,
        paddingRight: 64,
    },
    organizationName: {
        fontFamily: 'AtypText_medium',
        fontSize: 22,
        lineHeight: 22,
        color: 'white'
    },

    buttonBack: {
        marginLeft: -18,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8
    },

    headerAbsoluteBackground: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0
    }
});

Header.defaultProps = {
    scrollPosition: 0,

    showButtonBack: false,

    organization: {}
}

export default Header
