// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Logging from './Logging';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Logging);
