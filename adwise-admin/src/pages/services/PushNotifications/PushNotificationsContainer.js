// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import PushNotifications from './PushNotifications';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(PushNotifications);
