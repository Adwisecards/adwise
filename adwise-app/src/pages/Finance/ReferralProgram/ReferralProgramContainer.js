// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  updateAccount
} from "../../../AppState";

import ReferralProgram from './ReferralProgramView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({
      updateAccount: (user) => dispatch(updateAccount(user))
    }),
  ),
)(ReferralProgram);
