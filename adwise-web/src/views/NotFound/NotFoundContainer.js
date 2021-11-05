// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import NotFound from './NotFound';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(NotFound);
