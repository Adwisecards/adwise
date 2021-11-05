import {
    Platform
} from "react-native";
import * as Amplitude from 'expo-analytics-amplitude';
import axios from "../plugins/axios";
import urls from "../constants/urls";

const amplitudeLogEventAsync = async (eventName) => {
    await Amplitude.logEvent(eventName);
}

const amplitudeLogEventWithPropertiesAsync = async (eventName, properties) => {
    await Amplitude.logEventWithProperties(eventName, properties);

    await axios('post', urls["log-create-log"], {
        event: eventName,
        message: JSON.stringify(properties),
        platform: Platform.OS,
        app: 'cards'
    })
}
const amplitudeLogEventWithPropertiesErrorAsync = async (eventName, properties) => {
    await axios('post', urls["log-create-log"], {
        event: eventName,
        message: JSON.stringify(properties),
        platform: Platform.OS,
        app: 'cards',
        isError: true
    }).catch(error => {
        console.log('error: ', error.response)
    })
}

const amplitudeSetUserPropertiesAsync = async (userProperties) => {
    await Amplitude.setUserProperties(userProperties);
}

export {
    amplitudeLogEventAsync,
    amplitudeSetUserPropertiesAsync,
    amplitudeLogEventWithPropertiesAsync,
    amplitudeLogEventWithPropertiesErrorAsync
}
