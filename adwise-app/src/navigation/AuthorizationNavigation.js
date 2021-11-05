import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import AuthorizationTabNavigator from "./AuthorizationTabNavigator";

const stackNavigatorAuthorization = createStackNavigator(
    {
        Main: {
            screen: AuthorizationTabNavigator,
        },
    },
    {headerMode: 'none'},
);

export default createAppContainer(stackNavigatorAuthorization);
