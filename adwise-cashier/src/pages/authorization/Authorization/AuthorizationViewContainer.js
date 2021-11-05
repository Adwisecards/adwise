// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import AuthorizationView from './AuthorizationView';

import {
    updateAccount,
    setOrganization
} from '../../../AppState';

export default compose(
    connect(
        state => ({}),
        dispatch => ({
            updateAccount: (account) => dispatch(updateAccount(account)),
            setOrganization: (organization) => dispatch(setOrganization(organization))
        }),
    ),
)(AuthorizationView);
