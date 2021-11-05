// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Partner from './Partner';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Partner);
