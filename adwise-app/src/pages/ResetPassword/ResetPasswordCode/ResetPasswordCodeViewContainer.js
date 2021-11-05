// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ResetPasswordEmailView from './ResetPasswordCodeView';
import {updateAccount} from "../../../AppState";

export default compose(
  connect(
    state => ({}),
    dispatch => ({
      updateAccount: (user) => dispatch(updateAccount(user))
    }),
  ),
)(ResetPasswordEmailView);
