// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import PointsTotalView from './PointsTotalView';

export default compose(
    connect(
        state => ({
            account: state.app.account
        }),
        dispatch => ({}),
    ),
)(PointsTotalView);
