// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import CouponPageView from './CouponPageView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(CouponPageView);
