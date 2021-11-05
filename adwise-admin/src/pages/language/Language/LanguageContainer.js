// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Language from './Language';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Language);
