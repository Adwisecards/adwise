// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import SettingsView from './SettingsView';
import {updateLanguage} from "../../../AppState";

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
        updateLanguage: (language) => dispatch(updateLanguage(language))
    }),
  ),
)(SettingsView);
