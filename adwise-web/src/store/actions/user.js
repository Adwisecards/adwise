import { actions, actionTypes } from ".";
import { agent } from "../../axios";

export const setUser = (user) => {
    return {
        type: actionTypes.SET_USER,
        payload: user
    };
};

export const getMe = () => async dispatch => {
    try {
        dispatch(actions.ui.showLoader());
        const {data} = await agent.get('/accounts/users/me');
        dispatch(actions.ui.hideLoader());

        dispatch(setUser(data.data.user));

        return [data.data.user, null];
    } catch (ex) {
        return [null, ex.response.data.error];
    }
};

export const createUser = body => async dispatch => {
    try {
        dispatch(actions.ui.showLoader());
        const { data } = await agent.post('/accounts/users/create-user', body);
        dispatch(actions.ui.hideLoader());
        localStorage.setItem('jwt',data.data.jwt )
        agent.defaults.headers['authentication'] = data.data.jwt;
        dispatch(getMe());
        return [data.data, null];
    } catch (ex) {
        dispatch(actions.ui.showError(ex.response.data.error.message))
        dispatch(actions.ui.hideLoader());
        return [null, ex.response.data.error];
    }
};

export const signIn = body => async dispatch => {
    try {
        dispatch(actions.ui.showLoader());
        const { data } = await agent.post('/accounts/users/sign-in', body);
        dispatch(actions.ui.hideLoader());
        localStorage.setItem('jwt',data.data.jwt )
        agent.defaults.headers['authentication'] = data.data.jwt;
        dispatch(getMe());
        return [data.data, null];
    } catch (ex) {
        dispatch(actions.ui.showError(ex.response.data.error.message))
        dispatch(actions.ui.hideLoader());
        return [null, ex.response.data.error];
    }
};

export const verifyAccount = (id, code) => async dispatch => {
    try {
        dispatch(actions.ui.showLoader());
        const { data } = await agent.delete(`/accounts/verifications/delete-verification/${id}?code=${code}`);
        dispatch(actions.ui.hideLoader());

        dispatch(getMe());
        return [data.data.verificationId, null];
    } catch (ex) {
        dispatch(actions.ui.showError(ex.response.data.error.message))
        dispatch(actions.ui.hideLoader());
        return [null, ex.response.data.error];
    }
};

export const subscribeToUser = (body) => async dispatch => {
    try {
        dispatch(actions.ui.showLoader());
        const { data } = await agent.post('/contacts/create-request', body);
        dispatch(actions.ui.hideLoader());
        dispatch(actions.user.getMe());
        return [data.data.organizationId, null];
    } catch (ex) {
        dispatch(actions.ui.showError(ex.response.data.error.message))
        dispatch(actions.ui.hideLoader());
        return [null, ex.response.data.error]
    }
};
