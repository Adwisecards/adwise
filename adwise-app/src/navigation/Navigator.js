import React, {Component} from 'react';
import {connect} from "react-redux";
import {compose} from "recompose";
import AppNavigator from './RootNavigation';
import AuthorizationNavigation from "./AuthorizationNavigation";
import {
    Platform,
    Clipboard,
    KeyboardAvoidingView
} from 'react-native';
import {
    updateBadges,
    updateAppReady
} from '../AppState';
import {
    LanguageSelection as LanguageSelectionView
} from "../pages";
import {Host} from 'react-native-portalize';
import {setItemAsync} from "../helper/SecureStore";
import {getInviteCode} from "../helper/InviteCode";
import {getParamsInitialUrl} from "../helper/GetParamsInitialUrl";
import {setCurrentScreen} from "../helper/Analytics";

class NavigatorView extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount = async () => {
        await this.switchUrlApp();
        await this.checkBuffer();
    }


    switchUrlApp = async () => {
        const user_last_buffer = await Clipboard.getString();
        await setItemAsync('user_last_buffer', user_last_buffer);
    }
    checkBuffer = async () => {
        const urlParams = await getParamsInitialUrl();
        const code = await getInviteCode();

        if (!code && !urlParams?.invitation) {
            return null
        }

        let invite = code || urlParams.invitation;
        await setItemAsync('parentRefCode', invite)
    }

    onChangeScreen = async (prev, current) => {
        function getActiveRouteName(navigationState) {
            if (!navigationState) return null;
            const route = navigationState.routes[navigationState.index];
            if (route.routes) return getActiveRouteName(route);
            return route.routeName;
        }

        const path = getActiveRouteName(current);

        await setCurrentScreen(path);
    }

    render() {
        const {account, language} = this.props.app;

        let Navigator = AuthorizationNavigation;
        if (account && Object.keys(account).length > 0) {
            Navigator = AppNavigator;
        }
        if (!language) {
            Navigator = LanguageSelectionView;
        }


        return (
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
            >
                <Host>
                    <Navigator
                        onNavigationStateChange={this.onChangeScreen}
                    />
                </Host>
            </KeyboardAvoidingView>
        )
    }
}

export default compose(
    connect(
        state => ({
                app: state.app
            }

        ),
        dispatch => (
            {
                updateBadges: (badges) => dispatch(updateBadges(badges)),
                updateAppReady: (appReady) => dispatch(updateAppReady(appReady)),
            }
        ),
    ),
)
(NavigatorView);
