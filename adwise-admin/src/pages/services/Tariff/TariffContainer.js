// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Tariff from './Tariff';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Tariff);
