import { actions, actionTypes } from '.';
import { agent } from '../../axios';

export const setOrganization = (organization) => {
    return {
        type: actionTypes.SET_ORGANIZATION,
        payload: organization
    };
};

export const setRef = (ref) => {
    return {
        type: actionTypes.SET_REF,
        payload: ref
    };
};

export const setCouponRef = (ref) => {
    return {
        type: actionTypes.SET_COUPON_REF,
        payload: ref
    };
};

export const getOrganizationByInvitation = id => async dispatch => {
    try {
        dispatch(actions.ui.showLoader());
        const { data } = await agent.get('/organizations/get-organization-by-invitation/'+id);
        dispatch(actions.ui.hideLoader());

        return [data.data.organization, null];
    } catch (ex) {
        dispatch(actions.ui.hideLoader());
        return [null, ex.response.data.error];
    }
};

export const getContactById = id => async dispatch => {

    try {
        dispatch(actions.ui.showLoader());
        const data = await agent.get('/contacts/get-contact/'+id);
        dispatch(actions.ui.hideLoader());
        return [data.data.data.contact, null];
    } catch (ex) {
        dispatch(actions.ui.hideLoader());
        return [null, ex.response.data.error];
    }
};

export const getOrganizationById = id => async dispatch => {
    try {
        dispatch(actions.ui.showLoader());
        const { data } = await agent.get('/organizations/get-organization/'+id);
        dispatch(actions.ui.hideLoader());

        return [data.data.organization, null];
    } catch (ex) {
        dispatch(actions.ui.hideLoader());
        return [null, ex.response.data.error];
    }
};

export const getPurchaseById = id => async dispatch => {
    try {
        dispatch(actions.ui.showLoader());
        const { data } = await agent.get('/finance/get-purchase/'+id);
        dispatch(actions.ui.hideLoader());
        return [data.data.purchase, null];
    } catch (ex) {
        dispatch(actions.ui.hideLoader());
        return [null, ex.response.data.error];
    }
};

export const getCouponById = id => async dispatch => {
    try {
        dispatch(actions.ui.showLoader());
        const { data } = await agent.get('/organizations/get-coupon/'+id);
        dispatch(actions.ui.hideLoader());
        return [data.data.coupon, null];
    } catch (ex) {
        dispatch(actions.ui.hideLoader());
        return [null, ex.response.data.error];
    }
};

export const getRef = code => async dispatch => {
    try {
        dispatch(actions.ui.showLoader());
        const { data } = await agent.get('/refs/get-ref/'+code);
        dispatch(actions.ui.hideLoader());

        return [data.data.ref, null];
    } catch (ex) {
        dispatch(actions.ui.hideLoader());
        return [null, ex.response.data.error];
    }
};

export const getCoupon = id => async dispatch => {
    try {
        dispatch(actions.ui.showLoader());
        const { data } = await agent.get('/organizations/get-coupon/'+id);
        dispatch(actions.ui.hideLoader());

        return [data.data.coupon, null];
    } catch (ex) {
        dispatch(actions.ui.hideLoader());
        return [null, ex.response.data.error]
    }
};
export const getServices = id => async dispatch => {
    try {
        dispatch(actions.ui.showLoader());
        const { data } = await agent.get(`/organizations/get-products/${id}?limit=${10}&page=${1}/`);
        dispatch(actions.ui.hideLoader());

        return [data.data.products, null];
    } catch (ex) {
        dispatch(actions.ui.hideLoader());
        return [null, ex.response.data.error]
    }
};

export const subscribeToOrganization = (id, body) => async dispatch => {
    try {
        dispatch(actions.ui.showLoader());
        const { data } = await agent.put('/organizations/subscribe-to-organization/'+id, body);
        dispatch(actions.ui.hideLoader());

        dispatch(actions.user.getMe());
        return [data.data.organizationId, null];
    } catch (ex) {
        dispatch(actions.ui.showError(ex.response.data.error.message))
        dispatch(actions.ui.hideLoader());
        return [null, ex.response.data.error]
    }
};
