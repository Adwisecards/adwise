// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import MainScreenView from './MainScreenView';

import {setCompany} from './MainScreenState';
import {updateAccount} from '../../../AppState';

export default compose(
    connect(
        state => ({
            app: state.app,
            company: state.company
        }),
        dispatch => ({
            setCompany: (company) => dispatch(setCompany(company)),
            updateAccount: (account) => dispatch(updateAccount(account)),
        }),
    ),
)(MainScreenView);
