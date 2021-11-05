// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import RegistrationAccount from './RegistrationAccount';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(RegistrationAccount);
