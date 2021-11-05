// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import UserChatView from './UserChatView';
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
)(UserChatView);
