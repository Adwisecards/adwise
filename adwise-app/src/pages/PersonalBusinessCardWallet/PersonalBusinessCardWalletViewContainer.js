// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import PersonalBusinessCardWalletView from './PersonalBusinessCardWalletView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(PersonalBusinessCardWalletView);
