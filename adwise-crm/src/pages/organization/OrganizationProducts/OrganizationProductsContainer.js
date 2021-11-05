// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationProducts from './OrganizationProducts';

export default compose(
  connect(
    state => ({
      organization: state.app.organization
    }),
    dispatch => ({}),
  ),
)(OrganizationProducts);
