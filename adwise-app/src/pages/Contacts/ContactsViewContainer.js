// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ContactsView from './ContactsView';
import {updateKeyboardAvoidingViewEnabled} from "../../AppState";

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
        updateKeyboardAvoidingViewEnabled: (isKeyboardAvoidingViewEnabled) => dispatch(updateKeyboardAvoidingViewEnabled(isKeyboardAvoidingViewEnabled))
    }),
  ),
)(ContactsView);
