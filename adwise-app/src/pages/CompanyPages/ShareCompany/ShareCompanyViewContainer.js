// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import ShareCompanyView from './ShareCompanyView';

export default compose(
    connect(
        state => ({
            app: state.app,
            company: state.company
        }),
        dispatch => ({}),
    ),
)(ShareCompanyView);
