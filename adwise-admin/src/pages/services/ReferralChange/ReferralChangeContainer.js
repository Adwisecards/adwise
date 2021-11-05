// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ReferralChange from './ReferralChange';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(ReferralChange);
