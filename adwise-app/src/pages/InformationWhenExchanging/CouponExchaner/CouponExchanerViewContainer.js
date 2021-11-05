// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import CouponExchanerView from './CouponExchanerView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(CouponExchanerView);
