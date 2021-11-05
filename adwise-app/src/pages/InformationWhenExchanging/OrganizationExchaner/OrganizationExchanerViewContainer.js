// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationExchanerView from './OrganizationExchanerView';

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
)(OrganizationExchanerView);
