// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import HistoryView from './HistoryView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(HistoryView);
