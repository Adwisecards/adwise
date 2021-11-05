// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import UsersCompanyPagesView from './UsersCompanyPagesView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(UsersCompanyPagesView);
