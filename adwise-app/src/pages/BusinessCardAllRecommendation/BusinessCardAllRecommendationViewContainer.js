// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import BusinessCardAllRecommendationView from './BusinessCardAllRecommendationView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(BusinessCardAllRecommendationView);
