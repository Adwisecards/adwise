// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationClientPage from './OrganizationClientPage';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(OrganizationClientPage);
