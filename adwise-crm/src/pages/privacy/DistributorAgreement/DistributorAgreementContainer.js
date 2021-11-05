// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import DistributorAgreement from './DistributorAgreement';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(DistributorAgreement);
