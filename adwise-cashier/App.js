import Bugsnag from '@bugsnag/expo';
import React, {useState} from 'react';
import {
    Text,
    Image,
    TextInput,
    Dimensions,
    StyleSheet,
} from 'react-native';
import AppView from './src/AppViewContainer';
import {store} from "./src/redux/store";
import {Provider} from "react-redux";
import i18n from 'i18n-js';
import {useActionSheet} from '@expo/react-native-action-sheet';

Bugsnag.start();

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)
const enLang = require("./assets/lang/locale_en.json");
const ruLang = require("./assets/lang/locale_ru.json");

const { width } = Dimensions.get("window");

export default function App(props) {
    i18n.translations = {
        en: {...enLang},
        ru: {...ruLang},
    };
    i18n.locale = 'ru';
    i18n.fallbacks = true;

    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;

    if (TextInput.defaultProps == null) TextInput.defaultProps = {};
    TextInput.defaultProps.allowFontScaling = false;

    return (
        <ErrorBoundary FallbackComponent={ErrorView}>
            <Provider store={store}>
                <AppView version={props?.exp?.manifest?.version || ''}/>
            </Provider>
        </ErrorBoundary>
    );
}

class ErrorView extends React.Component {
    render() {
        return (
            <Page style={[stylesErrorPage.root, {paddingTop: heightStatusBar}]}>

                <Image source={IconAdWise} style={stylesErrorPage.iconApp}/>

                <Text style={stylesErrorPage.description}>
                    {'Возникла ошибка приложение.\nРазработчики уже получили сообщение об ошибке'}
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
