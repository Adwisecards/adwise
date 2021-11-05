// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import MyRecommendationView from './MyRecommendationView';

export default compose(
    connect(
        state => ({
          app: state.app
        }),
        dispatch => ({}),
    ),
)(MyRecommendationView);
