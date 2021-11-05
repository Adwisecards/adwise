const UPDATE_ACCOUNT = 'app/UPDATE_ACCOUNT'
const UPDATE_IS_ADMIN_GUEST = 'app/UPDATE_IS_ADMIN_GUEST'

const initialState = {
    account: null,
    isAdminGuest: false
};

export function setAccount(account) {
    return {
        type: UPDATE_ACCOUNT,
        account
    }
}
export function setIsAdminGuest(isAdminGuest) {
    return {
        type: UPDATE_IS_ADMIN_GUEST,
        isAdminGuest
    }
}

export default function AppState(state = initialState, action = {}) {
    switch (action.type) {
        case UPDATE_ACCOUNT: {
            let account = action.account

            return {
                ...state,
                account
            }
        }
        case UPDATE_IS_ADMIN_GUEST: {
            let isAdminGuest = action.isAdminGuest

            return {
                ...state,
                isAdminGuest
            }
        }
        default:
            return state;
    }
}
