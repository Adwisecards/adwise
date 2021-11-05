// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import CouponsDisabledView from './CouponsDisabledView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(CouponsDisabledView);
