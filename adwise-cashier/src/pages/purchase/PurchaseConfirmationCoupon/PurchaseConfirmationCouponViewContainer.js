// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import PurchaseConfirmationCouponView from './PurchaseConfirmationCouponView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(PurchaseConfirmationCouponView);
