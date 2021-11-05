// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import ProfileView from './ProfileView';

import {
    updateAccount,
    updateActiveCutaway
} from '../../AppState';

export default compose(
    connect(
        state => ({
            account: state.app.account
        }),
        dispatch => ({
            updateAccount: (account) => dispatch(updateAccount(account)),
            updateActiveCutaway: (activeCutaway) => dispatch(updateActiveCutaway(activeCutaway))
        }),
    ),
)(ProfileView);
