// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationCouponsCategoryView from './OrganizationCouponsCategoryView';

export default compose(
  connect(
    state => ({
      company: state.company
    }),
    dispatch => ({}),
  ),
)(OrganizationCouponsCategoryView);
