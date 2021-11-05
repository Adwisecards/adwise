// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Organizations from './Organizations';

export default compose(
  connect(
    state => ({
      global: state.global
    }),
    dispatch => ({}),
  ),
)(Organizations);
