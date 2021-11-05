import React from 'react';
import {
    Image,
    View,
    StyleSheet,
    Text,
    StatusBar,
    Dimensions
} from 'react-native';
import i18n from 'i18n-js';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import {
    Authorization as AuthorizationView
} from '../pages/index';

const TabBarComponent = props => <BottomTabBar {...props} />;

const { width, height } = Dimensions.get('window');
const heightStatusBar = StatusBar.currentHeight;
const widthTabItem = ((width - 24) / 4);

const styles = StyleSheet.create({
    containerTabBarComponent: {
        paddingHorizontal: 12,
        paddingBottom: 4,
        position: 'relative',
        overflow: 'hidden'
    },
    contentTabBarComponent: {
        height: 60,

        borderTopWidth: 2,
        borderTopColor: 'white',

        borderRightWidth: 2,
        borderRightColor: 'white',

        borderBottomWidth: 2,
        borderBottomColor: 'white',

        borderLeftWidth: 2,
        borderLeftColor: 'white',

        borderStyle: 'solid',
        borderRadius: 12,

        overflow: 'hidden',

        elevation: 1,
    },

    tabBarImageBackground: {
        zIndex: -1,

        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -heightStatusBar,

        height: height
    },

    tabBarItemContainer: {
        paddingVertical: 7,

        width: widthTabItem,
        height: '100%',

        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 2
    },
    tabBarItemContainerActive: {
        backgroundColor: '#eee4fe'
    },

    tabBarIconContainer: {
        width: 25,
        height: 25,

        marginBottom: 6
    },

    tabBarTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 9,
        lineHeight: 13,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        color: '#808080'
    },
    tabBarTitleFocused: {
        color: '#8152E4',
        fontFamily: 'AtypText_semibold'
    },
});

const defaultNavigationOptions = {
    headerStyle: {
        backgroundColor: '#f5f5f7',
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
    },
    headerBackTitleStyle: {
        tintColor: '#3F4063'
    },
    headerTintColor: '#3F4063',
    headerBackTitle: ' '
}
const transparentNavigationOptions = {
    headerStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
    },
    headerBackTitleStyle: {
        tintColor: 'rgba(0, 0, 0, 0)'
    },
    headerTintColor: 'rgba(0, 0, 0, 0)',
    headerBackTitle: ' '
}
const notHeaderNavigationOptions = {
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
        Authorization: {
            screen: createStackNavigator(
                {
                    Authorization: {
                        screen: AuthorizationView,
                        navigationOptions: notHeaderNavigationOptions
                    }
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            ),
        }
    },
    {
        defaultNavigationOptions: ({navigation, screenProps}) => ({
            tabBarIcon: ({focused}) => {
                return null
            },
            tabBarComponent: (props) => {
                return null
            }
        }),
        initialRouteName: 'Authorization',
        tabBarPosition: 'bottom',
        animationEnabled: true,
        swipeEnabled: true,
        tabBarOptions: {
            showIcon: true,
            showLabel: false,
            style: styles.contentTabBarComponent
        },
    },
);
