// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import CreateMultiplePurchaseView from './CreateMultiplePurchaseView';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({}),
  ),
)(CreateMultiplePurchaseView);
