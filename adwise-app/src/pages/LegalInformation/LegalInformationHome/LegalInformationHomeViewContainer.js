// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import LegalInformationHomeView from './LegalInformationHomeView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(LegalInformationHomeView);
