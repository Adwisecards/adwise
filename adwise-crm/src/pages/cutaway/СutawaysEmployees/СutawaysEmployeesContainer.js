// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import СutawaysEmployees from './СutawaysEmployees';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(СutawaysEmployees);
