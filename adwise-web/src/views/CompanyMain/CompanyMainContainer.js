// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import CompanyMain from './CompanyMain';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(CompanyMain);
