// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import PersonalExchanerView from './PersonalExchanerView';

import { loadContact } from '../../../AppState';

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
      loadContact: () => dispatch(loadContact())
    }),
  ),
)(PersonalExchanerView);
