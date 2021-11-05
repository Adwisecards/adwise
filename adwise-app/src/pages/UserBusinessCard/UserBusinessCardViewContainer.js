// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import UserBusinessCardView from './UserBusinessCardView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(UserBusinessCardView);
