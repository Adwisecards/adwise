// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import Registration–°onfirmationAccount from './Registration–°onfirmationAccount';

import {
    setAccount,
    setOrganization,
    setGlobal
} from '../../../AppState';

export default compose(
    connect(
        state => ({}),
        dispatch => ({
          setAccount: (account) => dispatch(setAccount(account)),
          setOrganization: (organization) => dispatch(setOrganization(organization)),
          setGlobal: (global) => dispatch(setGlobal(global)),
        }),
    ),
)(Registration–°onfirmationAccount);
