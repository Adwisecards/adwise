// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import PaymentPurchaseView from './PaymentPurchaseView';

import {
    updateAccount
} from '../../../AppState';

export default compose(
    connect(
        state => ({
            app: state.app
        }),
        dispatch => ({

        }),
    ),
)(PaymentPurchaseView);
