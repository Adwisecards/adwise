// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import SchedulerView from './SchedulerView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(SchedulerView);
