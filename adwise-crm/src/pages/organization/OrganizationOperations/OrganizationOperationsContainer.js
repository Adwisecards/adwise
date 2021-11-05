// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import OrganizationOperations from './OrganizationOperations';
import {
    setOrganization
} from "../../../AppState";

export default compose(
    connect(
        state => ({
            app: state.app
        }),
        dispatch => ({
            setOrganization: (organization) => dispatch(setOrganization(organization))
        }),
    ),
)(OrganizationOperations);
