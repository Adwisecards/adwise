// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import PurchaseHomeView from './PurchaseHomeView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(PurchaseHomeView);
