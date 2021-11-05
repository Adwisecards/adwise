// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import OrganizationAbout from './OrganizationAbout';

import app, {
    setOrganization,
    setShowRegistrationOrganization
} from '../../../AppState';

export default compose(
    connect(
        state => ({
            global: state.app
        }),
        dispatch => ({}),
    ),
)(OrganizationAbout);
