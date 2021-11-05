// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import Dashboard from './Dashboard';

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
)(Dashboard);
