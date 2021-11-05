// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import StartScreenView from './StartScreenView';

export default compose(
  connect(
    state => ({
      appVersion: state.app.appVersion
    }),
    dispatch => ({}),
  ),
)(StartScreenView);
