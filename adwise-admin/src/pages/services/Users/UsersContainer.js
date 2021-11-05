// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Users from './Users';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Users);
