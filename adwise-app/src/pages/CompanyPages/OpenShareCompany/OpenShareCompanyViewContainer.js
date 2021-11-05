// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OpenShareCompanyView from './OpenShareCompanyView';

import {
    updateAccount
} from '../../../AppState';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
        updateAccount: (account) => dispatch(updateAccount(account))
    }),
  ),
)(OpenShareCompanyView);
