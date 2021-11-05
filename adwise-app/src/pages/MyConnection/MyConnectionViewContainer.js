// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import MyConnectionView from './MyConnectionView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(MyConnectionView);
