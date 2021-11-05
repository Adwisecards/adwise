// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import QuestionAnswer from './QuestionAnswer';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(QuestionAnswer);
