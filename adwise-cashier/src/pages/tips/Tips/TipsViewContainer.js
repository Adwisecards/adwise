// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import TipsView from './TipsView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(TipsView);
