// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import TotalDataView from './TotalDataView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(TotalDataView);
