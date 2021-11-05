// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationEmployee from './OrganizationEmployee';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(OrganizationEmployee);
