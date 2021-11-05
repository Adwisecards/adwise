const UPDATE_ACCOUNT = 'app/UPDATE_ACCOUNT'
const UPDATE_ORGANIZATION = 'app/UPDATE_ORGANIZATION'
const UPDATE_GLOBAL = 'app/UPDATE_GLOBAL'
const UPDATE_COUNT_NOTIFICATION = 'app/UPDATE_COUNT_NOTIFICATION'
const UPDATE_MANAGER_ORGANIZATION = 'app/UPDATE_MANAGER_ORGANIZATION'
const UPDATE_TOTAL_COUNTS_SIDEBAR = 'app/UPDATE_TOTAL_COUNTS_SIDEBAR'
const UPDATE_SHOW_REGISTRATION_ORGANIZATION = 'app/UPDATE_SHOW_REGISTRATION_ORGANIZATION'

const initOrganization = {
    name: '',
    description: '',
    briefDescription: '',
    addressDetails: '',
    colors: {
        primary: '#0085FF'
    },

    placeId: null,
    category: null,

    cashback: 5,
    disabled: true,

    coupons: [],
    clients: [],
    employees: [],
    emails: [],
    phones: [],
    tags: [],
    products: [],
    distributionSchema: {
        first: 5,
        other: 0.5
    },

    address: {},
    packet: "",
    legal: {
        form: '',
        info: {}
    },
    socialNetworks: {vk: "", fb: "", insta: ""}
}

const initialState = {
    countNotification: 0,
    account: null,
    organization: initOrganization,
    global: null,
    totalCountsSidebar: null,
    managerOrganizations: [],
    isShowRegistrationOrganization: false
};

export function setAccount(account) {
    return {
        type: UPDATE_ACCOUNT,
        account
    }
}
export function setCountNotification(countNotification) {
    return {
        type: UPDATE_COUNT_NOTIFICATION,
        countNotification
    }
}
export function setOrganization(organization) {
    let newOrganization = {...organization};

    return {
        type: UPDATE_ORGANIZATION,
        organization: newOrganization
    }
}
export function setTotalCountsSidebar(totalCountsSidebar){
    return {
        type: UPDATE_TOTAL_COUNTS_SIDEBAR,
        totalCountsSidebar
    }
}
export function setShowRegistrationOrganization(isShowRegistrationOrganization){
    return {
        type: UPDATE_SHOW_REGISTRATION_ORGANIZATION,
        isShowRegistrationOrganization
    }
}

export function setManagerOrganizations(managerOrganizations) {
    return {
        type: UPDATE_MANAGER_ORGANIZATION,
        managerOrganizations
    }
}

export function setGlobal(global) {
    return {
        type: UPDATE_GLOBAL,
        global
    }
}

export default function AppState(state = initialState, action = {}) {
    switch (action.type) {
        case UPDATE_ORGANIZATION: {
            let organization = action.organization

            if (!organization){
                organization = initOrganization
            }

            return {
                ...state,
                organization
            }
        }
        case UPDATE_ACCOUNT: {
            let account = action.account

            return {
                ...state,
                account
            }
        }
        case UPDATE_GLOBAL: {
            let global = action.global

            return {
                ...state,
                global
            }
        }
        case UPDATE_COUNT_NOTIFICATION: {
            let countNotification = action.countNotification

            return {
                ...state,
                countNotification
            }
        }
        case UPDATE_MANAGER_ORGANIZATION: {
            let managerOrganizations = action.managerOrganizations

            return {
                ...state,
                managerOrganizations
            }
        }
        case UPDATE_TOTAL_COUNTS_SIDEBAR: {
            let totalCountsSidebar = action.totalCountsSidebar

            return {
                ...state,
                totalCountsSidebar
            }
        }
        case UPDATE_SHOW_REGISTRATION_ORGANIZATION: {
            let isShowRegistrationOrganization = action.isShowRegistrationOrganization

            return {
                ...state,
                isShowRegistrationOrganization
            }
        }
        default:
            return state;
    }
}
