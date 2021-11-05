// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import FeedbackPageView from './FeedbackPageView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(FeedbackPageView);
