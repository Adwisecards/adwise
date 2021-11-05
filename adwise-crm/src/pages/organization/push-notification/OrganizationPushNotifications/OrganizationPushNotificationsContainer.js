// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationPushNotifications from './OrganizationPushNotifications';

export default compose(
  connect(
    state => ({
      global: state.app
    }),
    dispatch => ({}),
  ),
)(OrganizationPushNotifications);
