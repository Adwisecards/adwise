// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationBillPage from './OrganizationBillPage';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(OrganizationBillPage);
