// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Purchases from './Purchases';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Purchases);
