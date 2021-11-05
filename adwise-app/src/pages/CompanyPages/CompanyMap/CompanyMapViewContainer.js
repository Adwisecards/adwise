// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import CompanyMapView from './CompanyMapView';

export default compose(
  connect(
    state => ({
      company: state.company.company
    }),
    dispatch => ({}),
  ),
)(CompanyMapView);
