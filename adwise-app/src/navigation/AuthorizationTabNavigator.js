import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';

import {
    Login as LoginView,

    RegisterHome as RegisterHomeView,
    RegisterCodeConfirmation as RegisterCodeConfirmationView,
    RegisterPhoneInput as RegisterPhoneInputView,

    ResetPasswordHome as ResetPasswordHomeView,
    ResetPasswordPhone as ResetPasswordPhoneView,
    ResetPasswordCode as ResetPasswordCodeView,

    StartScreen as StartScreenView
} from '../pages/index';

const defaultNavigationOptions = {
    headerStyle: {
        backgroundColor: '#F9F9FF',
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        height: 0,
        opacity: 0
    },
    headerBackTitleStyle: {
        tintColor: '#3F4063'
    },
    headerTintColor: '#3F4063',
    headerBackTitle: ' '
}

export default createBottomTabNavigator(
    {
        StartScreen: {
            screen: createStackNavigator({
                    StartScreen: {
                        screen: StartScreenView,
                        navigationOptions: defaultNavigationOptions
                    }
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            ),
        },
        Login: {
            screen: createStackNavigator(
                {
                    Login: {
                        screen: LoginView,
                        navigationOptions: defaultNavigationOptions
                    }
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            ),
        },
        Register: {
            screen: createStackNavigator(
                {
                    RegisterHome: {
                        screen: RegisterHomeView,
                        navigationOptions: defaultNavigationOptions
                    },

                    RegisterPhoneInput: {
                        screen: RegisterPhoneInputView,
                        navigationOptions: defaultNavigationOptions
                    },
                    RegisterCodeConfirmation: {
                        screen: RegisterCodeConfirmationView,
                        navigationOptions: defaultNavigationOptions
                    },
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            ),
        },
        ResetPassword: {
            screen: createStackNavigator(
                {
                    ResetPasswordHome: {
                        screen: ResetPasswordHomeView,
                        navigationOptions: defaultNavigationOptions
                    },
                    ResetPasswordPhone: {
                        screen: ResetPasswordPhoneView,
                        navigationOptions: defaultNavigationOptions
                    },
                    ResetPasswordCode: {
                        screen: ResetPasswordCodeView,
                        navigationOptions: defaultNavigationOptions
                    },
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            ),
        }
    },
    {
        defaultNavigationOptions: ({navigation, screenProps}) => ({
            tabBarComponent: () => {
                return null
            }
        }),
        initialRouteName: 'StartScreen',
        tabBarPosition: 'bottom',
        animationEnabled: true,
        swipeEnabled: true,
        tabBarOptions: {
            showIcon: false,
            showLabel: false,
            style: {
                backgroundColor: '#F9F9FF'
            }
        },
    },
);
