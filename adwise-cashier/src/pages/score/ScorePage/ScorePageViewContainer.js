// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ScorePageView from './ScorePageView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(ScorePageView);
