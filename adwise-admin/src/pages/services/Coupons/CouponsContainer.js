// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Coupons from './Coupons';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Coupons);
