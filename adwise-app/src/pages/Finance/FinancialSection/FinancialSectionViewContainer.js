// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import FinancialSectionView from './FinancialSectionView';
import {updateWallet} from "../../../AppState";

export default compose(
  connect(
    state => ({
      app: state.app
    }),
    dispatch => ({
        updateWallet: (wallet) => dispatch(updateWallet(wallet))
    }),
  ),
)(FinancialSectionView);
