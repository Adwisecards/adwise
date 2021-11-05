// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationShares from './OrganizationCoupons';

export default compose(
  connect(
    state => ({
      organization: state.app.organization
    }),
    dispatch => ({}),
  ),
)(OrganizationShares);
