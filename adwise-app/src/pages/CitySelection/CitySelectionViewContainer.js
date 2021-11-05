// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import CitySelectionView from './CitySelectionView';
import {updateCurrentCity, updateAccount} from "../../AppState";

export default compose(
    connect(
        state => ({
            app: state.app
        }),
        dispatch => ({
            updateCurrentCity: (city) => dispatch(updateCurrentCity(city)),
            updateAccount: (account) => dispatch(updateAccount(account)),
        }),
    ),
)(CitySelectionView);
