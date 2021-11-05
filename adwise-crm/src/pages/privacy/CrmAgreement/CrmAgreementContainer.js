// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import CrmAgreement from './CrmAgreement';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(CrmAgreement);
