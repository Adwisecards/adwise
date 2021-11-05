// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import PasswordReset from './PasswordReset';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(PasswordReset);
