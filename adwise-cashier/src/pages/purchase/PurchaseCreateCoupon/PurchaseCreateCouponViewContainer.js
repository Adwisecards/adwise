// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import PurchaseCreateCouponView from './PurchaseCreateCouponView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(PurchaseCreateCouponView);
