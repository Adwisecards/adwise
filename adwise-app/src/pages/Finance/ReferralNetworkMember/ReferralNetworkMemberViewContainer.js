// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ReferralNetworkMemberView from './ReferralNetworkMemberView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(ReferralNetworkMemberView);
