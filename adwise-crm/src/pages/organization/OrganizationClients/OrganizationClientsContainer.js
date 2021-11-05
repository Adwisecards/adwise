// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationClients from './OrganizationClients';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(OrganizationClients);
