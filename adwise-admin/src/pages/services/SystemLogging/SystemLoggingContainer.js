// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import SystemLogging from './SystemLogging';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(SystemLogging);
