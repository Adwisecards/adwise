// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import AboutCompanyView from './AboutCompanyView';

export default compose(
  connect(
    state => ({
      company: state.company
    }),
    dispatch => ({}),
  ),
)(AboutCompanyView);
