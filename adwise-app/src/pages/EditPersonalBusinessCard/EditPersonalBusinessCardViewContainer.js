// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import EditPersonalBusinessCardView from './EditPersonalBusinessCardView';

import {
    loadContact,
    updateAccount
} from '../../AppState';

export default compose(
  connect(
    state => ({}),
    dispatch => ({
        loadContact: () => dispatch(loadContact()),
        updateAccount: (account) => dispatch(updateAccount(account)),
    }),
  ),
)(EditPersonalBusinessCardView);
