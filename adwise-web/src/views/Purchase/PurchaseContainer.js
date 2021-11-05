// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Purchase from './Purchase';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Purchase);
