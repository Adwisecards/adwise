// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import WithdrawalRequest from './WithdrawalRequest';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(WithdrawalRequest);
