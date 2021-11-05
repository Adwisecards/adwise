// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ScoreSuccessView from './ScoreSuccessView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(ScoreSuccessView);
