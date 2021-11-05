// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ApplicationForm from './ApplicationForm';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(ApplicationForm);
