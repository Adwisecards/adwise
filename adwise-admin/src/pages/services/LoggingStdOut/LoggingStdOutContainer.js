// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import LoggingStdOut from './LoggingStdOut';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(LoggingStdOut);
