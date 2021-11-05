const SET_COMPANY = 'MainScreen/SET_COMPANY'

const initialState = {
    company: null
};

export function setCompany(company) {
    return {
        type: SET_COMPANY,
        company
    }
}

export default function UserInfo(state = initialState, action = {}) {
    switch (action.type) {
        case SET_COMPANY:{
            let company = action.company

            return {
                ...state,
                company
            }
        }
        default:
            return state;
    }
}
