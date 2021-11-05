// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationDocuments from './OrganizationDocuments';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(OrganizationDocuments);
