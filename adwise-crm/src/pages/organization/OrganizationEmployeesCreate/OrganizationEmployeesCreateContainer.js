// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationEmployeesCreate from './OrganizationEmployeesCreate';
import {
    setOrganization
} from '../../../AppState';

export default compose(
  connect(
    state => ({
      organization: state.app.organization
    }),
    dispatch => ({
        setOrganization: (organization) => dispatch(setOrganization(organization))
    }),
  ),
)(OrganizationEmployeesCreate);
