// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Accumulations from './Accumulations';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Accumulations);
