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
    ScorePage as ScorePageView,
    PointsTotal as PointsTotalView,
    TotalData as TotalDataView,
    ScoreSuccess as ScoreSuccessView,

    PurchaseHome as PurchaseHomeView,
    PurchaseCreateCoupon as PurchaseCreateCouponView,

    Invitation as InvitationView,

    History as HistoryView,
    HistoryPurchase as HistoryPurchaseView,

    Profile as ProfileView,
    ProfileAbout as ProfileAboutView,
    ProfileAboutEdit as ProfileAboutEditView,
    AboutApp as AboutAppView,

    PurchaseInvoicingCoupon as PurchaseInvoicingCouponView,
    PurchaseConfirmationCoupon as PurchaseConfirmationCouponView,

    Tips as TipsView
} from '../pages/index';

import {
    BottomNavigationScore,
    BottomNavigationProfile,
    BottomNavigationHistory,
    BottomNavigationInvitation,
    BottomNavigationTips
} from '../icons/index';
import imageBackground from "../../assets/graphics/login/bg.png";

const TabBarComponent = props => <BottomTabBar {...props} />;

const {width, height} = Dimensions.get('window');
const heightStatusBar = StatusBar.currentHeight;
const widthTabItem = ((width - 24) / 5);

const styles = StyleSheet.create({
    containerTabBarComponent: {
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
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,

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
        Purchase: {
            screen: createStackNavigator(
                {
                    PurchaseHome: {
                        screen: PurchaseHomeView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    PurchaseCreateCoupon: {
                        screen: PurchaseCreateCouponView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    PurchaseInvoicingCoupon: {
                        screen: PurchaseInvoicingCouponView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    PurchaseConfirmationCoupon: {
                        screen: PurchaseConfirmationCouponView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            ),
        },

        Invitation: {
            screen: createStackNavigator(
                {
                    ScorePage: {
                        screen: InvitationView,
                        navigationOptions: notHeaderNavigationOptions
                    }
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            ),
        },

        History: {
            screen: createStackNavigator(
                {
                    History: {
                        screen: HistoryView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    HistoryPurchase: {
                        screen: HistoryPurchaseView,
                        navigationOptions: notHeaderNavigationOptions
                    }
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            ),
        },

        Profile: {
            screen: createStackNavigator(
                {
                    Profile: {
                        screen: ProfileView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    ProfileAbout: {
                        screen: ProfileAboutView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    ProfileAboutEdit: {
                        screen: ProfileAboutEditView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    AboutApp: {
                        screen: AboutAppView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            ),
        },

        Tips: {
            screen: createStackNavigator(
                {
                    Tips: {
                        screen: TipsView,
                        navigationOptions: notHeaderNavigationOptions
                    }
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            ),
        },
    },
    {
        defaultNavigationOptions: ({navigation, screenProps}) => ({
            tabBarIcon: ({focused}) => {
                const {routeName} = navigation.state;
                let IconSource;
                let title;
                let type;

                switch (routeName) {
                    case 'Purchase':
                        IconSource = BottomNavigationScore;
                        title = 'Счет';
                        break;
                    case 'Invitation':
                        IconSource = BottomNavigationInvitation;
                        title = 'QR';
                        break;
                    case 'History':
                        IconSource = BottomNavigationHistory;
                        title = 'Заказы';
                        break;
                    case 'Profile':
                        IconSource = BottomNavigationProfile;
                        title = 'Профиль';
                        break;
                    case 'Tips':
                        IconSource = BottomNavigationTips;
                        title = 'ЧАЕВЫЕ';
                        break;
                    default:
                        IconSource = null;
                }

                if (!IconSource) {
                    return null
                }

                return (
                    <View style={[styles.tabBarItemContainer, focused && styles.tabBarItemContainerActive]}>
                        <View style={styles.tabBarIconContainer}>
                            <IconSource/>
                        </View>
                        <Text style={[styles.tabBarTitle, focused && styles.tabBarTitleFocused]}>{title}</Text>
                    </View>
                );
            },
            tabBarComponent: (props) => {
                return (
                    <View style={styles.containerTabBarComponent}>
                        <TabBarComponent
                            {...props}
                        />

                        <Image
                            style={[styles.tabBarImageBackground]}
                            source={imageBackground}
                        />
                    </View>
                )
            }
        }),
        initialRouteName: 'Purchase',
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
