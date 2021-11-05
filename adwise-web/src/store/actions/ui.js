import { actionTypes } from ".";

export const showLoader = () => {
    return {
        type: actionTypes.SHOW_LOADER
    };
};

export const hideLoader = () => {
    return {
        type: actionTypes.HIDE_LOADER
    };
};

export const hideError = () => {
    return {
        type: actionTypes.HIDE_ERROR
    };
};

export const showError = (message) => {
    return {
        type: actionTypes.SHOW_ERROR,
        payload: message
    };
};