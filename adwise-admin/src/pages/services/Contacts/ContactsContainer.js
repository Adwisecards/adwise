// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Contacts from './Contacts';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(Contacts);
