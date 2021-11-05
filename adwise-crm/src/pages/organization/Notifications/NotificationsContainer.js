// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
    setCountNotification
} from "../../../AppState";

import Notifications from './Notifications';

export default compose(
  connect(
    state => ({
      organization: state.app.organization
    }),
    dispatch => ({
        setCountNotification: (count) => dispatch(setCountNotification(count))
    }),
  ),
)(Notifications);
