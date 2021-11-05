// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import RegisterPhoneInputView from './RegisterPhoneInputView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(RegisterPhoneInputView);
