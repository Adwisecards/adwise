// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import PersonalArea from './PersonalArea';

import {
    setAccount
} from '../../../AppState';

export default compose(
  connect(
    state => ({
      account: state.app.account
    }),
    dispatch => ({
        setAccount: (account) => dispatch(setAccount(account))
    }),
  ),
)(PersonalArea);
