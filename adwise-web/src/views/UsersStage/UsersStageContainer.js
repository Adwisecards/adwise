// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import UsersStage from './UsersStage';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(UsersStage);
