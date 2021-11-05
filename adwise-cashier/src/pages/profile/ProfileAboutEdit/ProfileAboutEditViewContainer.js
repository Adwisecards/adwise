import { compose } from 'recompose';
import { connect } from 'react-redux';

import ProfileAboutEditView from './ProfileAboutEditView';

import {
    updateAccount
} from "../../../AppState";

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
        updateAccount: (account) => dispatch(updateAccount(account))
    }),
  ),
)(ProfileAboutEditView);
