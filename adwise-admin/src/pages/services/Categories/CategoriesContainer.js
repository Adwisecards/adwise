// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Categories from './Categories';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Categories);
