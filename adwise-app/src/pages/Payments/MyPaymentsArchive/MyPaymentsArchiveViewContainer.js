// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import MyPaymentsView from './MyPaymentsArchiveView';
import {updateAccount} from "../../../AppState";

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
        updateAccount: (account) => dispatch(updateAccount(account))
    }),
  ),
)(MyPaymentsView);
