// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import FeedbackView from './FeedbackView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(FeedbackView);
