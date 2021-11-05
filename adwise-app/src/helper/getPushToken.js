import {
    Platform
} from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";

async function getPushToken() {
    if (Constants.isDevice) {
        const {status: existingStatus} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }

        const experienceId = '@woddy/ad-wise-app';
        const pushToken = (await Notifications.getExpoPushTokenAsync({experienceId})).data;
        const deviceToken = (await Notifications.getDevicePushTokenAsync()).data;


        return {
            pushToken,
            deviceToken
        };
    } else {}

    return {
        pushToken: '',
        deviceToken: ''
    }
}

export default getPushToken
