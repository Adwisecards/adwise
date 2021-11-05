// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import RegistrationСonfirmationAccount from './RegistrationСonfirmationAccount';

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
)(RegistrationСonfirmationAccount);
