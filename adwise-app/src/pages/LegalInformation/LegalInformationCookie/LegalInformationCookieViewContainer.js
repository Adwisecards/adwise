// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import LegalInformationCookieView from './LegalInformationCookieView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(LegalInformationCookieView);
