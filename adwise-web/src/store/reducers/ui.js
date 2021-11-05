import { actionTypes } from "../actions";

const initialState = {
    loaderShown: false,
    error: ''
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SHOW_LOADER:
            return {
                ...state,
                loaderShown: true
            };
        case actionTypes.HIDE_LOADER:
            return {
                ...state,
                loaderShown: false
            };
        case actionTypes.HIDE_ERROR:
            return {
                ...state,
                error: ''
            };
        case actionTypes.SHOW_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};