// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import UserSubscriptions from './UserSubscriptions';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(UserSubscriptions);
