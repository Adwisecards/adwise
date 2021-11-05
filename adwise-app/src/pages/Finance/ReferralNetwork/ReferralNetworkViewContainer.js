// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ReferralNetworkView from './ReferralNetworkView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(ReferralNetworkView);
