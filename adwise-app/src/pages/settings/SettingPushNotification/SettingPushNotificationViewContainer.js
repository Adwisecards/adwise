// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import SettingPushNotificationView from './SettingPushNotificationView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(SettingPushNotificationView);
