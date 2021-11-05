// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Tasks from './Tasks';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Tasks);
