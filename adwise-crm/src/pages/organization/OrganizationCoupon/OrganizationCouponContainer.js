// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationCoupon from './OrganizationCoupon';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(OrganizationCoupon);
