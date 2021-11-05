// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Tips from './Tips';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Tips);
