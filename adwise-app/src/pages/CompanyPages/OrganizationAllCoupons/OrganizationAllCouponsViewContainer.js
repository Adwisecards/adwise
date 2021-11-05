// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationAllCouponsView from './OrganizationAllCouponsView';
import company from "../MainScreen/MainScreenState";

export default compose(
  connect(
    state => ({
        company: state.company
    }),
    dispatch => ({}),
  ),
)(OrganizationAllCouponsView);
