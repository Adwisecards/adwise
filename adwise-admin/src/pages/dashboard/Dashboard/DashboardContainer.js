// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Dashboard from './Dashboard';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Dashboard);
