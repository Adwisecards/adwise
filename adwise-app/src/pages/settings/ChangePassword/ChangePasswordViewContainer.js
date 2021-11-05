// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ChangePasswordView from './ChangePasswordView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(ChangePasswordView);
