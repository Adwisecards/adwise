// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationBills from './OrganizationBills';

export default compose(
  connect(
    state => ({
        app: state.app,
        organization: state.app.organization
    }),
    dispatch => ({}),
  ),
)(OrganizationBills);
