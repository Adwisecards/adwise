// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import СutawayUserInformationView from './СutawayUserInformationView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(СutawayUserInformationView);
