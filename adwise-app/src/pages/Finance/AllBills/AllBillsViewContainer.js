// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import AllBillsView from './AllBillsView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(AllBillsView);
