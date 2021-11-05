// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import FavoritesView from './FavoritesView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(FavoritesView);
