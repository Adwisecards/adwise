// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Contact from './Contact';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Contact);
