// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import SchedulerCreateView from './SchedulerCreateView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(SchedulerCreateView);
