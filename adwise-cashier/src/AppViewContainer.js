import { connect } from 'react-redux';
import {compose, lifecycle} from 'recompose';
import {Platform, UIManager} from 'react-native';

import AppView from './AppView';

import {
    setVersionApp,
    updateAccount,
    setOrganization
} from './AppState';

export default compose(
    connect(
        state => ({
            app: state.app
        }),
        dispatch => ({
            setVersionApp: (version) => dispatch(setVersionApp(version)),
            updateAccount: (account) => dispatch(updateAccount(account)),
            setOrganization: (organization) => dispatch(setOrganization(organization)),
        }),
    ),
    lifecycle({
        componentDidMount() {
            if (Platform.OS === 'android') {
                UIManager.getViewManagerConfig('setLayoutAnimationEnabledExperimental') && UIManager.getViewManagerConfig('setLayoutAnimationEnabledExperimental(true)');
            }
        },
    }),
)(AppView);
