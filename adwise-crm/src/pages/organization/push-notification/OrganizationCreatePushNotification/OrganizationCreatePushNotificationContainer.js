// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationCreatePushNotification from './OrganizationCreatePushNotification';

export default compose(
  connect(
    state => ({
      global: state.app
    }),
    dispatch => ({}),
  ),
)(OrganizationCreatePushNotification);
