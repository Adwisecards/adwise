// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import Authorization from './Authorization';

import {
    setAccount,
    setOrganization,
    setGlobal,
    setManagerOrganizations
} from '../../../AppState';

export default compose(
    connect(
        state => ({}),
        dispatch => ({
            setAccount: (account) => dispatch(setAccount(account)),
            setOrganization: (account) => dispatch(setOrganization(account)),
            setGlobal: (global) => dispatch(setGlobal(global)),
            setManagerOrganizations: (managerOrganizations) => dispatch(setManagerOrganizations(managerOrganizations))
        }),
    ),
)(Authorization);
