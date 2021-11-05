import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import MainTabNavigator from './MainTabNavigator';

const stackNavigator = createStackNavigator(
    {
        Main: {
            screen: MainTabNavigator,
        },
    },
    {headerMode: 'none'},
);

export default createAppContainer(stackNavigator);
