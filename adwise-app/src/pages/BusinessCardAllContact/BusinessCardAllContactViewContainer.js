// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import BusinessCardAllContactView from './BusinessCardAllContactView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(BusinessCardAllContactView);
