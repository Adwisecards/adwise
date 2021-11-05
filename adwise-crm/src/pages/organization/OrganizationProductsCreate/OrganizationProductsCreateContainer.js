// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationProductsCreate from './OrganizationProductsCreate';
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
)(OrganizationProductsCreate);
