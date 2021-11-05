// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import Authorization from './Authorization';

import {
    setAccount, setIsAdminGuest
} from "../../../globalStore";

export default compose(
    connect(
        state => ({}),
        dispatch => ({
            setAccount: (account) => dispatch(setAccount(account)),
            setIsAdminGuest: (isAdminGuest) => dispatch(setIsAdminGuest(isAdminGuest))
        }),
    ),
)(Authorization);
