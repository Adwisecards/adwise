// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Feedback from './Feedback';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Feedback);
