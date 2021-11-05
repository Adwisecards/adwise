import {getItemAsync} from "./helper/SecureStore";
import axios from "./plugins/axios";
import urls from "./constants/urls";

const UPDATE_ACCOUNT = 'app/UPDATE_ACCOUNT';
const UPDATE_VERSION_APP = 'app/UPDATE_VERSION_APP';
const UPDATE_ORGANIZATION = 'app/UPDATE_ORGANIZATION';
const UPDATE_ACTIVE_CUTAWAY = 'app/UPDATE_ACTIVE_CUTAWAY';

const initialState = {
    appVersion: '1.0.0',

    activeCutaway: '',

    language: null,

    account: null,

    organization: null,
};


export function updateAccount(account) {
    return {
        type: UPDATE_ACCOUNT,
        account
    }
}
export function setOrganization(organization) {
    return {
        type: UPDATE_ORGANIZATION,
        organization
    }
}
export function setVersionApp(version){
    return {
        type: UPDATE_VERSION_APP,
        version
    }
}

export function updateActiveCutaway(activeCutaway) {
    return {
        type: UPDATE_ACTIVE_CUTAWAY,
        activeCutaway
    }
}

export async function loadContact(){
    const account = await axios('get', urls["get-me"]).then(res => { return res.data.data.user });

    return {
        type: UPDATE_ACCOUNT,
        account
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
        case UPDATE_ORGANIZATION: {
            let organization = action.organization

            return {
                ...state,
                organization
            }
        }
        case UPDATE_ACTIVE_CUTAWAY:{
            let activeCutaway = action.activeCutaway

            return {
                ...state,
                activeCutaway: activeCutaway
            }
        }
        case UPDATE_VERSION_APP:{
            let version = action.version

            return {
                ...state,
                appVersion: version
            }
        }

        default:
            return state;
    }
}
