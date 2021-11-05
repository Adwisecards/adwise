// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import ContactsCompanyView from './ContactsCompanyView';

export default compose(
    connect(
        state => ({
            company: state.company
        }),
        dispatch => ({}),
    ),
)(ContactsCompanyView);
