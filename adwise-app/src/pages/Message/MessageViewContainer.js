// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import MessageView from './MessageView';

import { loadContact, updateAccount } from '../../AppState';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
        loadContact: () => dispatch(loadContact()),
        updateAccount: (account) => dispatch(updateAccount(account))
    }),
  ),
)(MessageView);
