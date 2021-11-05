import React, {Component, useRef} from 'react';
import {StyleProvider} from 'native-base';
import Navigator from './navigation/Navigator';
import getTheme from './theme/components';
import material from './theme/variables/material';
import {persistor} from "./redux/store";
import * as Font from 'expo-font';
import {
    getAndroidVersion
} from 'mobile-app-version';
import {
    StatusBar,
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    TouchableOpacity,
    Platform
} from "react-native";
import {PersistGate} from 'redux-persist/integration/react'
import {
    Page,
    Splash,
    DropDownHolder, ModalNotification
} from "./components";
import {
    MaterialIcons
} from '@expo/vector-icons';
import {ActionSheetProvider, connectActionSheet} from '@expo/react-native-action-sheet'
import axios from "./plugins/axios";
import {getItemAsync, setItemAsync, deleteItemAsync} from "./helper/SecureStore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropdownAlert from "react-native-dropdownalert";
import urls from "./constants/urls";
import FlashMessage from "react-native-flash-message";
import {
    Warn,
    Success,
    Info,
    Error
} from "./icons";
import {
    Icon
} from "native-base";
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import {Camera} from "expo-camera";
import Constants from "expo-constants";
import {amplitudeSetUserPropertiesAsync} from "./helper/Amplitude";
import IconAdWise from "../assets/graphics/logos/logos_black.png";
import {getIosVersion} from "./plugins/appVersion";
import {
    ModalUpdateApp,
    ModalLoading
} from "./components";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});
FlashMessage.setColorTheme({
    success: '#61AE2C',
    info: '#1DA8F6',
    warning: '#ED8E00',
    danger: '#EA2424'
});

const {width} = Dimensions.get('window');

const infoImageSrc = require('../assets/images/alerts/info.png');
const warnImageSrc = require('../assets/images/alerts/warn.png');
const errorImageSrc = require('../assets/images/alerts/error.png');
const successImageSrc = require('../assets/images/alerts/succes.png');

class AppView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isServiceWorks: false,
            isNeedUpdate: false
        };

        this.updateUpdateGlobal = null;
    }

    componentDidMount = async () => {

        await this.initialApp();

    }

    initialApp = async () => {

        this.setState({isLoading: true});

        const global = await axios('get', urls["get-global"]).then((response) => {
            return response.data.data.global;
        }).catch(() => {
            return {}
        });

        await this.checkAppVersion(global?.app || {});

        const isServiceWorks = global?.technicalWorks;

        if (isServiceWorks) {
            this.setState({ isServiceWorks, isLoading: false });

            return null
        }

        await this.onStartLoadingApp(global);
    }
    checkAppVersion = async (appVersion) => {
        const iosVersionShop = appVersion?.cards?.ios?.versions?.stable || '0.0.0';
        const androidVersionShop = appVersion?.cards?.android?.versions?.stable || '0.0.0';
        const versionShop = Boolean(Platform.OS === 'ios') ? iosVersionShop : androidVersionShop;

        const currentVersion = parseInt(Constants.manifest.version.replace(/\D+/g, ""));
        const stableVersion = parseInt(versionShop.replace(/\D+/g, ""));

        this.setState({
            isNeedUpdate: Boolean(currentVersion < stableVersion)
        })
    }

    onStartLoadingApp = async (global) => {
        const language = await this.onSetCurrentLocale();

        await this.onLoadFonts();
        await this.onCheckUser(language);
        await this.onSetCurrentCity();
        await this.onCheckPermission();
        await this.onSetCurrentVersionApp();
        await this.onLoadGlobalSettings(global);

        this.setState({isLoading: false})
    }
    onLoadFonts = async () => {
        await Font.loadAsync({
            Roboto: require('native-base/Fonts/Roboto.ttf'),
            Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),

            AtypDisplay: require('../assets/fonts/Atyp_Display.ttf'),
            AtypDisplay_bold: require('../assets/fonts/Atyp_Display_Bold.ttf'),
            AtypDisplay_light: require('../assets/fonts/Atyp_Display_Light.ttf'),
            AtypDisplay_medium: require('../assets/fonts/Atyp_Display_Medium.ttf'),
            AtypDisplay_semibold: require('../assets/fonts/Atyp_Display_Semibold.ttf'),
            AtypDisplay_thin: require('../assets/fonts/Atyp_Display_Thin.ttf'),

            AtypText: require('../assets/fonts/Atyp_Text.ttf'),
            AtypText_bold: require('../assets/fonts/Atyp_Text_Bold.ttf'),
            AtypText_light: require('../assets/fonts/Atyp_Text_Light.ttf'),
            AtypText_medium: require('../assets/fonts/Atyp_Text_Medium.ttf'),
            AtypText_semibold: require('../assets/fonts/Atyp_Text_Semibold.ttf'),
            AtypText_thin: require('../assets/fonts/Atyp_Text_Thin.ttf'),

            AtypVariable: require('../assets/fonts/Atyp_Variable.ttf'),

            ...MaterialIcons.font,
        });
    }
    onCheckUser = async (language) => {
        // await setItemAsync('jwt', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6ZmFsc2UsInVzZXJJZCI6IjYwNDBjOTFlODgyZTY0MDAxMWM5ZDk1ZCIsImFkbWluR3Vlc3QiOmZhbHNlLCJpYXQiOjE2MjczNzkxMjcsImV4cCI6MTYzNTE1NTEyN30.ZdYRcgf8WHFm9MQ1Uch0VpGFv-NYYKm98tGoO4o6UjA');
        const jwt = await getItemAsync('jwt');

        if (!jwt) {
            return null
        }

        const user = await axios('get', `${urls["get-me"]}?platform=${Platform.OS}&language=${language}`).then((res) => {
            return res.data.data.user
        }).catch((error) => {
            console.log('error: ', error.response);
        });

        if (!user) {
            await deleteItemAsync('jwt');
            return null
        }

        this.props.updateAccount(user);

        await amplitudeSetUserPropertiesAsync({
            user_id: user._id,
            user_first_name: user.firstName,
            user_last_name: user.lastName,
            updates: JSON.stringify(Constants.manifest.updates),
            version: JSON.stringify(Constants.manifest.version)
        });

        this.onLoadCouponsFavorites();

    }
    onSetCurrentCity = async () => {
        const currentCity = await getItemAsync('current_city');
        if (!currentCity) {
            return null
        }

        this.props.updateCurrentCity(currentCity)
    }
    onSetCurrentLocale = async () => {
        const locale = await getItemAsync('application_language');
        this.props.updateLanguage(locale);

        return locale
    }
    onCheckPermission = async () => {
        await Permissions.askAsync(Permissions.NOTIFICATIONS)
        await Camera.requestPermissionsAsync();
        await Permissions.askAsync(Permissions.LOCATION);
    }
    onSetCurrentVersionApp = async () => {
        this.props.setVersionApp(Constants.manifest.version);
    }
    onLoadGlobalSettings = async (global) => {
        this.props.updateGlobal(global);
    }
    onLoadCouponsFavorites = () => {

        axios('get', urls['coupons-get-user-favorite-coupons']).then((res) => {
            const coupons = res.data.data.coupons;

            this.props.updateFavorites(coupons);
        })

    }

    render() {
        if (this.state.isLoading) {
            return (
                <Page style={{flex: 1}}>
                    <Splash message="Идёт загрузка..."/>
                </Page>
            )
        }

        if (this.state.isServiceWorks) {
            return (
                <Page style={[stylesErrorPage.root]}>

                    <Image source={IconAdWise} style={stylesErrorPage.iconApp}/>

                    <Text style={stylesErrorPage.description}>
                        {'Ведутся технические работы'}
                    </Text>

                    <TouchableOpacity style={styles.button} onPress={this.initialApp}>
                        <Text style={styles.buttonText}>Обновить</Text>
                    </TouchableOpacity>

                </Page>
            )
        }

        return (
            <PersistGate
                loading={<Splash/>}
                persistor={persistor}
            >
                <StatusBar
                    barStyle={'dark-content'}
                    backgroundColor={'rgba(255, 255, 255, 0)'}
                    translucent={true}
                />
                <StyleProvider style={getTheme(material)}>
                    <ActionSheetProvider>
                        <Navigator uriPrefix="/app"/>
                    </ActionSheetProvider>
                </StyleProvider>

                <DropdownAlert
                    ref={ref => DropDownHolder.setDropDown(ref)}

                    closeInterval={5000}
                    zIndex={9999999999999}

                    warnColor={'#ED8E00'}
                    errorColor={'#EA2424'}
                    successColor={'#61AE2C'}
                    infoColor={'#1DA8F6'}

                    wrapperStyle={stylesDropdownAlert.wrapperStyle}
                    defaultContainer={stylesDropdownAlert.defaultContainer}
                    defaultTextContainer={stylesDropdownAlert.defaultTextContainer}
                    contentContainerStyle={stylesDropdownAlert.contentContainerStyle}

                    titleStyle={stylesDropdownAlert.titleStyle}
                    imageStyle={stylesDropdownAlert.imageStyle}
                    messageStyle={stylesDropdownAlert.messageStyle}

                    infoImageSrc={infoImageSrc}
                    warnImageSrc={warnImageSrc}
                    errorImageSrc={errorImageSrc}
                    successImageSrc={successImageSrc}

                    translucent
                    updateStatusBar={false}
                />

                <FlashMessage
                    position="bottom"

                    style={stylesFlashMessage.defaultContainer}
                    titleStyle={styles.titleStyle}
                    textStyle={styles.messageStyle}


                    MessageComponent={(props) => flashMessageCustomContent(props)}
                />

                <ModalUpdateApp
                    isOpen={this.state.isNeedUpdate}
                    onClose={() => this.setState({isNeedUpdate: false})}
                />

                <ModalNotification
                    ref={ref => DropDownHolder.setModalNotification(ref)}
                />

            </PersistGate>
        )
    }
}

const flashMessageCustomContent = (props) => {
    const {message} = props;

    return (
        <TouchableOpacity
            style={[
                stylesFlashMessage.container,
                (message.isHideNavigation) && stylesFlashMessage.containerHideStatusBar,

                message.type === 'success' && stylesFlashMessage.containerSuccess,
                message.type === 'info' && stylesFlashMessage.containerInfo,
                message.type === 'warning' && stylesFlashMessage.containerWarning,
                message.type === 'danger' && stylesFlashMessage.containerDanger,
            ]}

            onPress={props.onClick}
        >
            <View style={stylesFlashMessage.containerIcon}>
                {message.type === 'success' && (
                    <Success/>
                )}
                {message.type === 'info' && (
                    <Info/>
                )}
                {message.type === 'warning' && (
                    <Warn/>
                )}
                {message.type === 'danger' && (
                    <Error/>
                )}
            </View>
            <View style={stylesFlashMessage.containerLeft}>
                <Text style={stylesFlashMessage.title}>{message.message}</Text>
                <Text
                    style={stylesFlashMessage.message}
                    numberOfLines={3}
                >{message.description}</Text>
            </View>

            <Icon name="close" type="MaterialIcons" style={stylesFlashMessage.iconClose}/>
        </TouchableOpacity>
    )
}

const ConnectedAppView = connectActionSheet(AppView)

const styles = StyleSheet.create({
    titleStyle: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        color: 'white'
    },
    messageStyle: {
        fontFamily: 'AtypText',
        fontSize: 14,
        color: 'white'
    },
    wrapperStyle: {
        flex: 1,
        backgroundColor: 'red'
    },
    contentContainerStyle: {
        flex: 1
    },

    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 6,
        backgroundColor: '#8152E4',
        marginTop: 16
    },
    buttonText: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 15,
        color: 'white'
    }
});
const stylesErrorPage = StyleSheet.create({
    root: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center'

    },

    iconApp: {
        width: 100,
        height: 100,

        marginBottom: 24
    },

    title: {
        fontSize: 24,
        lineHeight: 26
    },
    description: {
        fontSize: 18,
        lineHeight: 26,

        maxWidth: width * 0.8,

        textAlign: 'center'
    }
});
const stylesDropdownAlert = StyleSheet.create({
    wrapperStyle: {},
    defaultContainer: {
        paddingVertical: 16,
        paddingHorizontal: 20
    },
    defaultTextContainer: {
        flex: 1
    },
    contentContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    titleStyle: {
        fontFamily: 'AtypText_semibold',
        fontSize: 16,
        lineHeight: 19,
        color: 'white',

        marginBottom: 4
    },
    imageStyle: {
        marginRight: 24,

        width: 40,
        height: 40,

        justifyContent: 'center',
        alignItems: 'center'
    },
    messageStyle: {
        flex: 1,

        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 14,
        color: 'white',
        opacity: 0.6
    },
});
const stylesFlashMessage = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 16,
        paddingHorizontal: 18,

        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,

        marginBottom: 48
    },
    containerHideStatusBar: {
        marginBottom: 0
    },

    containerSuccess: {
        backgroundColor: '#61AE2C'
    },
    containerInfo: {
        backgroundColor: '#1DA8F6'
    },
    containerWarning: {
        backgroundColor: '#ED8E00'
    },
    containerDanger: {
        backgroundColor: '#EA2424'
    },

    containerIcon: {
        width: 40,
        height: 40,

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 18
    },
    containerLeft: {
        flex: 1
    },

    title: {
        fontFamily: 'AtypText_semibold',
        fontSize: 16,
        lineHeight: 19,
        color: 'white',

        marginBottom: 4
    },
    message: {
        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 14,
        color: 'white',
        opacity: 0.6
    },

    iconClose: {
        width: 12,
        height: 12,
        color: 'white',
        opacity: 0.5,
        position: 'absolute',
        top: 10,
        right: 10,
        fontSize: 15
    },
});

export default ConnectedAppView
