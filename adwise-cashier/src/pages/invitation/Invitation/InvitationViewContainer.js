// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import InvitationView from './InvitationView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(InvitationView);
