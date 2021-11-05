// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import SelectedCityView from './SelectedCityView';

import {
  updateCurrentCity
} from '../../AppState';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
      updateCurrentCity: (city) => dispatch(updateCurrentCity(city))
    }),
  ),
)(SelectedCityView);
