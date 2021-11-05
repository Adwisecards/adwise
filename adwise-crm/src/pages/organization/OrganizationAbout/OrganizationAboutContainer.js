// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import OrganizationAbout from './OrganizationAbout';

import {
    setOrganization,
    setShowRegistrationOrganization
} from '../../../AppState';

export default compose(
    connect(
        state => ({
            organization: state.app.organization,
            account: state.app.account
        }),
        dispatch => ({
            setOrganization: (organization) => dispatch(setOrganization(organization)),
            setShowRegistrationOrganization: (isShowRegistrationOrganization) => dispatch(setShowRegistrationOrganization(isShowRegistrationOrganization))
        }),
    ),
)(OrganizationAbout);
