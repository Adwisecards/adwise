// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ProfileView from './ProfileView';

import {
    updateAccount,
    setOrganization
} from '../../../AppState';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
        updateAccount: (account) => dispatch(updateAccount(account)),
        setOrganization: (organization) => dispatch(setOrganization(organization)),
    }),
  ),
)(ProfileView);
