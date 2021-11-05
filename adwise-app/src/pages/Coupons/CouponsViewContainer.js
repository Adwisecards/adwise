// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import CouponsView from './CouponsView';
import {updateFavorites} from "../../AppState";

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
        updateFavorites: (favorites) => dispatch(updateFavorites(favorites)),
    }),
  ),
)(CouponsView);
