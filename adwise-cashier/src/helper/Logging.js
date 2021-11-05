import {Platform} from "react-native";
import axios from "../plugins/axios";
import urls from "../constants/urls";

const amplitudeLogEventWithPropertiesAsync = async (eventName, properties) => {
    await axios('post', urls["log-create-log"], {
        event: eventName,
        message: JSON.stringify(properties),
        platform: Platform.OS,
        app: 'business'
    })
}

export {
    amplitudeLogEventWithPropertiesAsync
}
