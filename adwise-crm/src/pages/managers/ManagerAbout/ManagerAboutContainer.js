// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import ManagerAbout from './ManagerAbout';

export default compose(
    connect(
        state => ({
            app: state.app,
            organization: state.app.organization
        }),
        dispatch => ({}),
    ),
)(ManagerAbout);
