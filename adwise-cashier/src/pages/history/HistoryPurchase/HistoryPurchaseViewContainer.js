// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import HistoryPurchaseView from './HistoryPurchaseView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(HistoryPurchaseView);
