// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Settings from './Settings';
import global from "../../../globalStore";

export default compose(
  connect(
    state => ({
        global: state.global
    }),
    dispatch => ({}),
  ),
)(Settings);
