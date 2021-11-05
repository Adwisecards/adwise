import { connect } from 'react-redux';
import {compose, lifecycle} from 'recompose';
import {Platform, UIManager} from 'react-native';

import AppView from './AppView';

import {
    updateAccount,
    updateCurrentCity,
    updateAppReady,
    setVersionApp,
    updateGlobal,
    updateLanguage,
    updateFavorites
} from './AppState';

export default compose(
    connect(
        state => ({
            app: state.app
        }),
        dispatch => ({
            updateAccount: (account) => dispatch(updateAccount(account)),
            updateCurrentCity: (currentCity) => dispatch(updateCurrentCity(currentCity)),
            updateAppReady: (appReady) => dispatch(updateAppReady(appReady)),
            setVersionApp: (versionApp) => dispatch(setVersionApp(versionApp)),
            updateGlobal: (global) => dispatch(updateGlobal(global)),
            updateLanguage: (locale) => dispatch(updateLanguage(locale)),
            updateFavorites: (favorites) => dispatch(updateFavorites(favorites)),
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
