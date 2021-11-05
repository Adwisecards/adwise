// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationChangeRequests from './OrganizationChangeRequests';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(OrganizationChangeRequests);
