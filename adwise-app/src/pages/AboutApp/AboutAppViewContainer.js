// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import AboutAppView from './AboutAppView';

export default compose(
  connect(
    state => ({
      appVersion: state.app.appVersion
    }),
    dispatch => ({}),
  ),
)(AboutAppView);
