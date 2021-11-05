// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationEmployees from './OrganizationEmployees';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(OrganizationEmployees);
