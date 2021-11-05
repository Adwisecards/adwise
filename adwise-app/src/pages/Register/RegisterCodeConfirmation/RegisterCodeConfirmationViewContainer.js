// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import RegisterCodeConfirmationView from './RegisterCodeConfirmationView';

import {
  updateAccount
} from '../../../AppState';

export default compose(
  connect(
    state => ({}),
    dispatch => ({
      updateAccount: (account) => dispatch(updateAccount(account))
    }),
  ),
)(RegisterCodeConfirmationView);
