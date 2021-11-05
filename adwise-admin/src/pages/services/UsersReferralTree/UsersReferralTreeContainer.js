// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import UsersReferralTree from './UsersReferralTree';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(UsersReferralTree);
