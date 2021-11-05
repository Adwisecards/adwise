// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import CouponsAllView from './CouponsAllView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(CouponsAllView);
