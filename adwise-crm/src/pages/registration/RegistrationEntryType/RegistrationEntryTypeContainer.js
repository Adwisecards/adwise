// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import RegistrationEntryType from './RegistrationEntryType';

import {
  setAccount
} from "../../../AppState";

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
      setAccount: (account) => dispatch(setAccount(account))
    }),
  ),
)(RegistrationEntryType);
