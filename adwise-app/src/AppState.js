import axios from "./plugins/axios";
import urls from "./constants/urls";
import getError from "./helper/getErrors";
import DropDownHolder from "./components/DropDownHolder/DropDownHolder";

const UPDATE_BADGES = 'app/UPDATE_BADGES';
const UPDATE_ACCOUNT = 'app/UPDATE_ACCOUNT';
const UPDATE_CURRENT_CITY = 'app/UPDATE_CURRENT_CITY';
const UPDATE_ACTIVE_CUTAWAY = 'app/UPDATE_ACTIVE_CUTAWAY';
const UPDATE_APP_READY = 'app/UPDATE_APP_READY';
const SET_VERSION_APP = 'app/SET_VERSION_APP';
const UPDATE_WALLET = 'app/UPDATE_WALLET';
const UPDATE_KEYBOARD_ENABLED = 'app/UPDATE_KEYBOARD_ENABLED';
const UPDATE_GLOBAL = 'app/UPDATE_GLOBAL';
const UPDATE_LANGUAGE = 'app/UPDATE_LANGUAGE';
const UPDATE_COUPONS_FAVORITES = 'app/UPDATE_COUPONS_FAVORITES';

const initialState = {
    appVersion: '1.0.0',

    activeCutaway: '',
    currentCity: "",

    global: {},

    language: null,

    account: null,
    wallet: null,

    badges: {
        message: 0
    },

    appReady: true,
    isKeyboardAvoidingViewEnabled: true,

    couponsFavorites: []
};

export function updateAccount(account) {
    return {
        type: UPDATE_ACCOUNT,
        account
    }
}
export function updateWallet(wallet) {
    return {
        type: UPDATE_WALLET,
        wallet
    }
}

export function setVersionApp(appVersion) {
    return {
        type: SET_VERSION_APP,
        appVersion
    }
}

export function updateCurrentCity(currentCity){
    return {
        type: UPDATE_CURRENT_CITY,
        currentCity
    }
}

export function updateBadges(badges){
    return {
        type: UPDATE_BADGES,
        badges
    }
}

export function updateActiveCutaway(activeCutaway) {
    return {
        type: UPDATE_ACTIVE_CUTAWAY,
        activeCutaway
    }
}

export function updateKeyboardAvoidingViewEnabled(isKeyboardAvoidingViewEnabled){
    return {
        type: UPDATE_KEYBOARD_ENABLED,
        isKeyboardAvoidingViewEnabled
    }
}

export function updateGlobal(global){
    return {
        type: UPDATE_GLOBAL,
        global
    }
}

export function updateLanguage(language) {
    return {
        type: UPDATE_LANGUAGE,
        language
    }
}

export async function loadContact(){
    const account = await axios('get', urls["get-me"]).then(res => { return res.data.data.user }).catch(error => {
        const errorBody = getError(error.response);
        DropDownHolder.dropDown.alertWithType('error', errorBody.title, errorBody.message);

        return false
    });

    if (!account){
        return null
    }

    return {
        type: UPDATE_ACCOUNT,
        account
    }
}

export function updateAppReady (appReady){
    return {
        type: UPDATE_APP_READY,
        appReady
    }
}

export function updateFavorites (couponsFavorites) {

    return {
        type: UPDATE_COUPONS_FAVORITES,
        couponsFavorites
    }
}

// Reducer
export default function HomeState(state = initialState, action = {}) {
    switch (action.type) {
        case UPDATE_ACCOUNT:{
            let account = action.account

            return {
                ...state,
                account: account
            }
        }
        case UPDATE_ACTIVE_CUTAWAY:{
            let activeCutaway = action.activeCutaway

            return {
                ...state,
                activeCutaway: activeCutaway
            }
        }
        case UPDATE_CURRENT_CITY:{
            let currentCity = action.currentCity

            return {
                ...state,
                currentCity: currentCity
            }
        }
        case UPDATE_BADGES:{
            let badges = action.badges

            return {
                ...state,
                badges: badges
            }
        }
        case UPDATE_APP_READY:{
            let appReady = action.appReady

            return {
                ...state,
                appReady: appReady
            }
        }
        case SET_VERSION_APP:{
            let appVersion = action.appVersion

            return {
                ...state,
                appVersion: appVersion
            }
        }
        case UPDATE_WALLET:{
            let wallet = action.wallet

            return {
                ...state,
                wallet: wallet
            }
        }
        case UPDATE_KEYBOARD_ENABLED:{
            let isKeyboardAvoidingViewEnabled = action.isKeyboardAvoidingViewEnabled

            return {
                ...state,
                isKeyboardAvoidingViewEnabled: isKeyboardAvoidingViewEnabled
            }
        }
        case UPDATE_GLOBAL:{
            let global = action.global

            return {
                ...state,
                global: global
            }
        }
        case UPDATE_LANGUAGE:{
            let language = action.language

            return {
                ...state,
                language: language
            }
        }
        case UPDATE_COUPONS_FAVORITES:{
            let couponsFavorites = action.couponsFavorites

            return {
                ...state,
                couponsFavorites: couponsFavorites
            }
        }

        default:
            return state;
    }
}
