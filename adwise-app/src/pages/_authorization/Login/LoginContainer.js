// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Login from './LoginView';

import app, { updateAccount } from '../../../AppState';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
      updateAccount: account => dispatch(updateAccount(account))
    }),
  ),
)(Login);
