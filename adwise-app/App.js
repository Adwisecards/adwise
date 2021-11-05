import Bugsnag from '@bugsnag/expo';
import React, {useState, useRef, useEffect} from 'react';
import {
    Text,
    View,
    Image,
    TextInput,
    Dimensions,
    StyleSheet,
} from 'react-native';
import * as Amplitude from 'expo-analytics-amplitude';
import AppView from './src/AppViewContainer';
import {store} from "./src/redux/store";
import {Provider} from "react-redux";
import i18n from 'i18n-js';
import Constants from 'expo-constants';
import getHeightStatusBar from "./src/helper/getHeightStatusBar";
import {Page} from "./src/components";
import IconAdWise from "./assets/graphics/logos/logos_black.png";
import {getItemAsync} from "./src/helper/SecureStore";

Bugsnag.start();

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)
const enLang = require("./assets/lang/locale_en.json");
const ruLang = require("./assets/lang/locale_ru.json");

const { width } = Dimensions.get('window');

const heightStatusBar = getHeightStatusBar();

export default function App(props) {
    return (
        <ErrorBoundary FallbackComponent={ErrorView}>
            <AppContainer/>
        </ErrorBoundary>
    )
}

class AppContainer extends React.Component {
    componentDidMount = async () => {
        const locale = await getItemAsync('application_language');
        i18n.translations = {
            en: {...enLang},
            ru: {...ruLang},
        };
        i18n.locale = locale || 'ru';
        i18n.fallbacks = true;
    }

    render() {
        Amplitude.initialize('d723098b6c1d7426c5363c40974e2f72');

        if (Text.defaultProps == null) Text.defaultProps = {};
        Text.defaultProps.allowFontScaling = false;

        if (TextInput.defaultProps == null) TextInput.defaultProps = {};
        TextInput.defaultProps.allowFontScaling = false;

        return (
            <Provider store={store}>
                <AppView varsionApp={Constants.manifest.version}/>
            </Provider>
        )
    }
}

class ErrorView extends React.Component {
    render() {
        return (
            <Page style={[stylesErrorPage.root, {paddingTop: heightStatusBar}]}>

                <Image source={IconAdWise} style={stylesErrorPage.iconApp}/>

                <Text style={stylesErrorPage.description}>
                    { 'Возникла ошибка приложение.\nРазработчики уже получили сообщение об ошибке' }
                </Text>
            </Page>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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
