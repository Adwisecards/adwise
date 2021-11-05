import {
    Share,
    Platform
} from "react-native";

const SendShare = async ({ title, message, url }) => {
    const isIos = Boolean(Platform.OS === 'ios');

    let share = {
        title: title|| 'AdWise',
        message: message,
    }

    // if (isIos) {
    //     share['url'] = url
    // }

    const result = await Share.share(share);

    if (result.action === Share.sharedAction){}
    if (result.action === Share.dismissedAction){}
}

export default SendShare
