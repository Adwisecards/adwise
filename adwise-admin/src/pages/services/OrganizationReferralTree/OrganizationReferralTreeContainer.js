// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationReferralTree from './OrganizationReferralTree';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(OrganizationReferralTree);
