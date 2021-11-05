// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import PurchaseInvoicingCouponView from './PurchaseInvoicingCouponView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(PurchaseInvoicingCouponView);
