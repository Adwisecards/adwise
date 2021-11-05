import axiosInstance from "../agent/agent";
import urls from "../constants/urls";

var userDeviceArray = [
    {device: 'android', platform: /Android/},
    {device: 'ios', platform: /iPhone/},
    {device: 'android', platform: /Windows Phone/},
    {device: 'ios', platform: /Tablet OS/},
    {device: 'pc', platform: /Linux/},
    {device: 'pc', platform: /Windows NT/},
    {device: 'pc', platform: /Macintosh/}
];

const loggingLogEvent = async (eventName) => {}
const loggingLogEventWithProperties = async (eventName, properties, isError = false) => {
    const body = {
        event: eventName,
        platform: getPlatform(),
        app: 'web',
        message: JSON.stringify(properties),
        isError
    };

    await axiosInstance.post(urls["log-create-log"], body)
}

const getPlatform = () => {
    let platform = navigator.userAgent;
    for (let i in userDeviceArray) {
        if (userDeviceArray[i].platform.test(platform)) {
            return userDeviceArray[i].device;
        }
    }
    return null;
}

export {
    loggingLogEvent,
    loggingLogEventWithProperties
}
