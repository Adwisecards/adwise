// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import BusinessStage from './BusinessStage';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(BusinessStage);
