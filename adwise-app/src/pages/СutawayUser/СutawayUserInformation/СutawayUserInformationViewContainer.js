// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Š”utawayUserInformationView from './Š”utawayUserInformationView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(Š”utawayUserInformationView);
