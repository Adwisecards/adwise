// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import PersonalBusinessCardView from './PersonalBusinessCardView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(PersonalBusinessCardView);
