// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import CompanyHomeView from './CompanyHomeView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(CompanyHomeView);
