// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import BankPayments from './BankPayments';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(BankPayments);
