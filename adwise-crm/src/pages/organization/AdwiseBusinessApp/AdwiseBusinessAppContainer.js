// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import AdwiseBusinessApp from './AdwiseBusinessApp';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(AdwiseBusinessApp);
