// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import FinanceHomeView from './FinanceHomeView';
import {updateWallet, updateAccount} from "../../../AppState";

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
        updateWallet: (wallet) => dispatch(updateWallet(wallet)),
        updateAccount: (user) => dispatch(updateAccount(user))
    }),
  ),
)(FinanceHomeView);
