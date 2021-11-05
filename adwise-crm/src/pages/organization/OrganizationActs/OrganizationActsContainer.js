// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import OrganizationActs from './OrganizationActs';

export default compose(
  connect(
    state => ({
      global: state.app
    }),
    dispatch => ({}),
  ),
)(OrganizationActs);
