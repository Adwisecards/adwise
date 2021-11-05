// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import DashboardView from './DashboardView';

import {
    updateAccount,
    updateActiveCutaway,
    updateWallet
} from '../../AppState';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
        updateActiveCutaway: (activeCutaway) => dispatch(updateActiveCutaway(activeCutaway)),
        updateAccount: (account) => dispatch(updateAccount(account)),
        updateWallet: (wallet) => dispatch(updateWallet(wallet)),
    }),
  ),
)(DashboardView);
