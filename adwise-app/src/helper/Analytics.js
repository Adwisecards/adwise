import * as Analytics from "expo-firebase-analytics";

// user
const setUserId = (id) => {}
const setUserProperties = (properties) => {}

// navigation
const setCurrentScreen = (path) => {
    Analytics.setCurrentScreen(path);
}

// events
const logEvent = async (name, properties) => {
    await Analytics.logEvent(name, properties);
}

export {
    setUserId,
    setUserProperties,

    setCurrentScreen,

    logEvent
}
