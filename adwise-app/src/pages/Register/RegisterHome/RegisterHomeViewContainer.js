// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import RegisterHomeView from './RegisterHomeView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(RegisterHomeView);
