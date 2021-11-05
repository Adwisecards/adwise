// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Documents from './Documents';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Documents);
