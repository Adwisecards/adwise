// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ChangeHistory from './ChangeHistory';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(ChangeHistory);
