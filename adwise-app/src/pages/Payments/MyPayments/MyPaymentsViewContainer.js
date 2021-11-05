// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import MyPaymentsView from './MyPaymentsView';
import {updateAccount, updateKeyboardAvoidingViewEnabled} from "../../../AppState";

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
        updateAccount: (account) => dispatch(updateAccount(account)),
        updateKeyboardAvoidingViewEnabled: (isKeyboardAvoidingViewEnabled) => dispatch(updateKeyboardAvoidingViewEnabled(isKeyboardAvoidingViewEnabled))
    }),
  ),
)(MyPaymentsView);
