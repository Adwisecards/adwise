// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import –°utawaysEmployees from './–°utawaysEmployees';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(–°utawaysEmployees);
