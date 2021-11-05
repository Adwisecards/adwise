import { actionTypes } from "../actions";

const initialState = {
    organization: null,
    ref: null,
    couponRef: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_ORGANIZATION:
            return {
                ...state,
                organization: action.payload
            };
        case actionTypes.SET_REF:
            return {
                ...state,
                ref: action.payload
            };
        case actionTypes.SET_COUPON_REF:
            return {
                ...state,
                ref: action.payload
            };
        default:
            return state;
    }
};