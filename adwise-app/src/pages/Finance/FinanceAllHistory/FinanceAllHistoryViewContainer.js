// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import FinanceAllHistoryView from './FinanceAllHistoryView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(FinanceAllHistoryView);
