// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationTariffs from './OrganizationTariffs';
import {
    setOrganization
} from '../../../AppState';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
        setOrganization: (organization) => dispatch(setOrganization(organization))
    }),
  ),
)(OrganizationTariffs);
