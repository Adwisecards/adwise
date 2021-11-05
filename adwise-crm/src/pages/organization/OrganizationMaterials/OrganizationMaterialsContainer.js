// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationMaterials from './OrganizationMaterials';

export default compose(
  connect(
    state => ({
      global: state.app.global
    }),
    dispatch => ({}),
  ),
)(OrganizationMaterials);
