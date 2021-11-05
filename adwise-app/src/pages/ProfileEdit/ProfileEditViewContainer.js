// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ProfileEditView from './ProfileEditView';

import { updateAccount } from '../../AppState';

export default compose(
  connect(
    state => ({
      account: state.app.account
    }),
    dispatch => ({
        updateAccount: (account) => dispatch(updateAccount(account))
    }),
  ),
)(ProfileEditView);
