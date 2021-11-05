// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import AccountView from './AccountView';

import {
    updateAccount, updateActiveCutaway
} from '../../AppState';

export default compose(
    connect(
        state => ({
            app: state.app
        }),
        dispatch => ({
            updateAccount: (account) => dispatch(updateAccount(account)),
            updateActiveCutaway: (activeCutaway) => dispatch(updateActiveCutaway(activeCutaway))
        }),
    ),
)(AccountView);
