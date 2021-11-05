import React, {Component} from 'react';
import {
    KeyboardAvoidingView
} from "react-native";
import {connect} from "react-redux";
import {compose} from "recompose";
import AppNavigator from './RootNavigation';
import AuthorizationNavigation from './AuthorizationNavigation';

class NavigatorView extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        if (!this.props.app.account) {
            return (
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                    <AuthorizationNavigation/>
                </KeyboardAvoidingView>
            )
        }

        return (
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                <AppNavigator/>
            </KeyboardAvoidingView>
        )
    }
}

export default compose(
    connect(
        state => ({
            app: state.app
        }),
        dispatch => ({}),
    ),
)(NavigatorView);
