import * as actionTypes from './actionTypes';
import * as organizationActions from './organization';
import * as userActions from './user';
import * as uiActions from './ui';

export const actions = {
    organization: organizationActions,
    user: userActions,
    ui: uiActions
};

export {
    actionTypes
};