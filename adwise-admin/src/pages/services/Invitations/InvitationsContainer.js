// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Invitations from './Invitations';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Invitations);
