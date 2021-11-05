import React, {Component, useRef} from 'react';
import {StyleProvider} from 'native-base';
import Navigator from './navigation/Navigator';
import getTheme from './theme/components';
import material from './theme/variables/material';
import {persistor} from "./redux/store";
import * as Font from 'expo-font';
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
    Splash,
    DropDownHolder,
    Page
} from "./components";
import {
    MaterialIcons
} from '@expo/vector-icons';
import i18n from "i18n-js";
import {ActionSheetProvider, connectActionSheet} from '@expo/react-native-action-sheet'
import axios from "./plugins/axios";
import {deleteItemAsync, getItemAsync, setItemAsync} from "./helper/SecureStore";
import DropdownAlert from "react-native-dropdownalert";
import urls from "./constants/urls";
import * as Amplitude from 'expo-analytics-amplitude';
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
import {amplitudeLogEventWithPropertiesAsync, amplitudeSetUserPropertiesAsync} from "./helper/Amplitude";
import IconAdWise from "../assets/graphics/logos/logos_black.png";
import {getInviteCode} from "./helper/InviteCode";
import * as Linking from "expo-linking";

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
            isServiceWorks: false
        };

        this.updateUpdateGlobal = null;
    }

    componentDidMount = async () => {
        const jwt = await getItemAsync('jwt');

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

        await this.setLocale();
        await this.getGlobalSettings();
        await this.getAllPermissions();
        await this.setCurrentCity();
        await this.setVersionApp();
        await this.checkActiveUserSystem();

        if (!jwt) {
            this.setState({isLoading: false});

            return null
        }

        await this.getMe();
    }

    getMe = async () => {
        const response = await axios('get', `${urls["get-me"]}?platform=${ Platform.OS }`).then(response => {
            return {
                status: 'success',
                data: response.data.data
            }
        }).catch(error => {
            return {
                status: 'error',
                data: error.response.data
            }
        })

        if (response.status === 'error') {
            this.setState({isLoading: false});

            return null
        }
        this.props.updateAccount(response.data.user);

        await amplitudeSetUserPropertiesAsync({
            user_id: response.data.user._id,
            user_first_name: response.data.user.firstName,
            user_last_name: response.data.user.lastName,
            updates: JSON.stringify(Constants.manifest.updates),
            version: JSON.stringify(Constants.manifest.version)
        });

        this.setState({isLoading: false});
    }
    setLocale = async () => {
        // await deleteItemAsync('application_language');
        const locale = await getItemAsync('application_language');

        if (!locale) {
            return null
        }

        i18n.locale = locale;
    }
    setCurrentCity = async () => {
        const currentCity = await getItemAsync('current_city');

        if (!currentCity) {
            return null
        }

        this.props.updateCurrentCity(currentCity)
    }
    getAllPermissions = async () => {
        await Permissions.askAsync(Permissions.NOTIFICATIONS)
        await Camera.requestPermissionsAsync();
        await Permissions.askAsync(Permissions.LOCATION);
    }
    setVersionApp = async () => {
        this.props.setVersionApp(this.props.varsionApp);
    }
    getGlobalSettings = async () => {
        axios('get', urls["get-global"]).then((response) => {
            const {global} = response.data.data;

            this.props.updateGlobal(global);
        });
    }

    checkActiveUserSystem = () => {
        axios('get', urls["get-global"]).then((response) => {
            const global = response.data.data.global;
            const isServiceWorks = global.technicalWorks;

            if (isServiceWorks && this.updateUpdateGlobal === null) {
                this.updateUpdateGlobal = setInterval(() => {
                    this.checkActiveUserSystem()
                }, 30000)
            } else {
                clearInterval(this.updateUpdateGlobal);
                this.updateUpdateGlobal = null;
            }

            this.setState({
                isServiceWorks
            });


        });
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
