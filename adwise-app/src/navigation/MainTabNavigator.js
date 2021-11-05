import React from 'react';
import {
    Image,
    View,
    StyleSheet,
    Text,
    StatusBar
} from 'react-native';
import i18n from 'i18n-js';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import {
    Account as AccountView,

    Contacts as ContactsView,

    Favorites as FavoritesView,

    Message as MessageView,

    Coupons as CouponsView,
    CouponPage as CouponPageView,

    AboutApp as AboutAppView,

    Settings as SettingsView,

    Certificates as CertificatesView,

    Search as SearchView,

    Profile as ProfileView,
    ProfileEdit as ProfileEditView,

    Feedback as FeedbackView,
    FeedbackPage as FeedbackPageView,

    Scheduler as SchedulerView,
    SchedulerCreate as SchedulerCreateView,
    SchedulerInformation as SchedulerInformationView,

    Dashboard as DashboardView,

    SelectedCity as SelectedCityView,

    UserBusinessCard as UserBusinessCardView,

    PersonalBusinessCard as PersonalBusinessCardView,
    PersonalBusinessCardWallet as PersonalBusinessCardWalletView,
    EditPersonalBusinessCard as EditPersonalBusinessCardView,

    PersonalExchaner as PersonalExchanerView,
    PersonalAcceptOffer as PersonalAcceptOfferView,
    OrganizationExchaner as OrganizationExchanerView,

    CutawayUserInformation as CutawayUserInformationView,

    MyConnection as MyConnectionView,

    MyRecommendation as MyRecommendationView,

    CompanyMap as CompanyMapView,
    CompanyHome as CompanyHomeView,
    ShareCompany as ShareCompanyView,
    AboutCompany as AboutCompanyView,
    ContactsCompany as ContactsCompanyView,
    CompanyPageMain as CompanyPageMainView,
    OpenShareCompany as OpenShareCompanyView,
    UsersCompanyPages as UsersCompanyPagesView,
    OrganizationAllCoupons as OrganizationAllCouponsView,
    CreateMultiplePurchase as CreateMultiplePurchaseView,
    OrganizationCouponsCategory as OrganizationCouponsCategoryView,

    FinanceHome as FinanceHomeView,
    ReferralProgram as ReferralProgramView,
    ReferralNetwork as ReferralNetworkView,
    FinancialSection as FinancialSectionView,
    FinanceAllHistory as FinanceAllHistoryView,
    ReferralNetworkMember as ReferralNetworkMemberView,
    AllUsersReferralProgram as AllUsersReferralProgramView,

    MyPayments as MyPaymentsView,
    PaymentPurchase as PaymentPurchaseView,
    MyPaymentsArchive as MyPaymentsArchiveView,
    PaymentPurchaseYandexKassa as PaymentPurchaseYandexKassaView,

    WorkBusinessCard as WorkBusinessCardView,

    LegalInformationTermsUse as LegalInformationTermsUseView,
    LegalInformationHome as LegalInformationHomeView,
    LegalInformationCookie as LegalInformationCookieView,
    LegalInformationPricavy as LegalInformationPricavyView,

    BusinessCardAllContact as BusinessCardAllContactView,
    BusinessCardAllRecommendation as BusinessCardAllRecommendationView,

    CouponsAll as CouponsAllView,
    CouponsDisabled as CouponsDisabledView,

    HistoryChangeApp as HistoryChangeAppView,

    ChangePassword as ChangePasswordView,

    SettingPushNotification as SettingPushNotificationView,

    UserChat as UserChatView,

    CitySelection as CitySelectionView,
} from '../pages/index';
import {
    BottomNavigationMore,
    BottomNavigationCoupons,
    BottomNavigationFinance,
    BottomNavigationContacts,
    BottomNavigationBusinessCards,
    BottomNavigationOrders
} from '../icons';
import allTranslations from "../localization/allTranslations";
import localization from "../localization/localization";

const TabBarComponent = props => <BottomTabBar {...props} />;

const styles = StyleSheet.create({
    tabBarItemContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5
    },

    tabBarIconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabBarIcon: {
        flex: 1,
        maxWidth: 30,
        tintColor: '#9f9f9f'
    },
    tabBarIconFocused: {
        tintColor: '#8152E4',
    },

    tabBarTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 10,
        lineHeight: 14,
        color: '#000000',
        opacity: 0.4
    },
    tabBarTitleFocused: {
        color: '#8152E4',
        opacity: 1
    },
});

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
        Dashboard: {
            screen: createStackNavigator(
                {
                    Dashboard: {
                        screen: DashboardView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    UserBusinessCard: {
                        screen: UserBusinessCardView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    PersonalBusinessCard: {
                        screen: PersonalBusinessCardView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    PersonalBusinessCardWallet: {
                        screen: PersonalBusinessCardWalletView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    EditPersonalBusinessCard: {
                        screen: EditPersonalBusinessCardView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    WorkBusinessCard: {
                        screen: WorkBusinessCardView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    Scheduler: {
                        screen: SchedulerView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    SchedulerCreate: {
                        screen: SchedulerCreateView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    SchedulerInformation: {
                        screen: SchedulerInformationView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    SelectedCity: {
                        screen: SelectedCityView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    PersonalExchaner: {
                        screen: PersonalExchanerView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    PersonalAcceptOffer: {
                        screen: PersonalAcceptOfferView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    OrganizationExchaner: {
                        screen: OrganizationExchanerView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    CutawayUserInformation: {
                        screen: CutawayUserInformationView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    MyConnection: {
                        screen: MyConnectionView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    MyRecommendation: {
                        screen: MyRecommendationView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    Search: {
                        screen: SearchView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    CompanyHome: {
                        screen: CompanyHomeView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    CompanyPageMain: {
                        screen: CompanyPageMainView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    AboutCompany: {
                        screen: AboutCompanyView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    ContactsCompany: {
                        screen: ContactsCompanyView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    ShareCompany: {
                        screen: ShareCompanyView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    CompanyMap: {
                        screen: CompanyMapView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    UsersCompanyPages: {
                        screen: UsersCompanyPagesView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    OpenShareCompany: {
                        screen: OpenShareCompanyView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    OrganizationAllCoupons: {
                        screen: OrganizationAllCouponsView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    CreateMultiplePurchase: {
                        screen: CreateMultiplePurchaseView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    OrganizationCouponsCategory: {
                        screen: OrganizationCouponsCategoryView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    CouponPage: {
                        screen: CouponPageView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    BusinessCardAllContact: {
                        screen: BusinessCardAllContactView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    BusinessCardAllRecommendation: {
                        screen: BusinessCardAllRecommendationView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    CitySelection: {
                        screen: CitySelectionView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            ),
        },

        Coupons: {
            screen: createStackNavigator(
                {
                    Coupons: {
                        screen: CouponsView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    CouponPage: {
                        screen: CouponPageView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    CouponsAll: {
                        screen: CouponsAllView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            ),
        },

        Bills: {
            screen: createStackNavigator(
                {
                    MyPayments: {
                        screen: MyPaymentsView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    PaymentPurchase: {
                        screen: PaymentPurchaseView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    PaymentPurchaseYandexKassa: {
                        screen: PaymentPurchaseYandexKassaView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            ),
        },

        Finance: {
            screen: createStackNavigator(
                {
                    FinanceHome: {
                        screen: FinanceHomeView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    FinancialSection: {
                        screen: FinancialSectionView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    ReferralProgram: {
                        screen: ReferralProgramView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    ReferralNetworkMember: {
                        screen: ReferralNetworkMemberView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    ReferralNetwork: {
                        screen: ReferralNetworkView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    FinanceAllHistory: {
                        screen: FinanceAllHistoryView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    AllUsersReferralProgram: {
                        screen: AllUsersReferralProgramView,
                        navigationOptions: notHeaderNavigationOptions
                    }
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            ),
        },

        More: {
            screen: createStackNavigator(
                {
                    Account: {
                        screen: AccountView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    Profile: {
                        screen: ProfileView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    ProfileEdit: {
                        screen: ProfileEditView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    Settings: {
                        screen: SettingsView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    AboutApp: {
                        screen: AboutAppView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    HistoryChangeApp: {
                        screen: HistoryChangeAppView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    Feedback: {
                        screen: FeedbackView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    FeedbackPage: {
                        screen: FeedbackPageView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    Message: {
                        screen: MessageView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    Certificates: {
                        screen: CertificatesView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    MyPaymentsArchive: {
                        screen: MyPaymentsArchiveView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    CouponsDisabled: {
                        screen: CouponsDisabledView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    LegalInformationHome: {
                        screen: LegalInformationHomeView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    LegalInformationCookie: {
                        screen: LegalInformationCookieView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    LegalInformationPricavy: {
                        screen: LegalInformationPricavyView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    LegalInformationTermsUse: {
                        screen: LegalInformationTermsUseView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    ChangePassword: {
                        screen: ChangePasswordView,
                        navigationOptions: notHeaderNavigationOptions
                    },


                    Contacts: {
                        screen: ContactsView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    SettingPushNotification: {
                        screen: SettingPushNotificationView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    UserChat: {
                        screen: UserChatView,
                        navigationOptions: notHeaderNavigationOptions
                    },

                    // Общие компонеты
                    CutawayUserInformation: {
                        screen: CutawayUserInformationView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    CompanyHome: {
                        screen: CompanyHomeView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    CompanyPageMain: {
                        screen: CompanyPageMainView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    AboutCompany: {
                        screen: AboutCompanyView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    ContactsCompany: {
                        screen: ContactsCompanyView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    ShareCompany: {
                        screen: ShareCompanyView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    CompanyMap: {
                        screen: CompanyMapView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    UsersCompanyPages: {
                        screen: UsersCompanyPagesView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    OpenShareCompany: {
                        screen: OpenShareCompanyView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    OrganizationAllCoupons: {
                        screen: OrganizationAllCouponsView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    CreateMultiplePurchase: {
                        screen: CreateMultiplePurchaseView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                    OrganizationCouponsCategory: {
                        screen: OrganizationCouponsCategoryView,
                        navigationOptions: notHeaderNavigationOptions
                    },
                },
                {
                    defaultNavigationOptions: {...TransitionPresets.SlideFromRightIOS}
                }
            )
        },
    },
    {
        defaultNavigationOptions: ({navigation, screenProps, navigationOptions, theme}) => ({
            tabBarIcon: ({focused}) => {
                const {routeName} = navigation.state;
                let IconSource;
                let title;
                let type;

                switch (routeName) {
                    case 'Dashboard':
                        IconSource = BottomNavigationBusinessCards;
                        title = allTranslations(localization.bottomNavigationDashboard);
                        break;
                    case 'Contacts':
                        IconSource = BottomNavigationContacts;
                        title = allTranslations(localization.bottomNavigationContacts);
                        break;
                    case 'Finance':
                        IconSource = BottomNavigationFinance;
                        title = allTranslations(localization.bottomNavigationFinance);
                        break;
                    case 'Coupons':
                        IconSource = BottomNavigationCoupons;
                        title = allTranslations(localization.bottomNavigationCoupons);
                        break;
                    case 'Bills':
                        IconSource = BottomNavigationOrders;
                        title = allTranslations(localization.bottomNavigationBills);
                        break;
                    case 'More':
                        IconSource = BottomNavigationMore;
                        title = allTranslations((localization.bottomNavigationMore));
                        type = 'more';
                        break;
                    default:
                        IconSource = null;
                }

                if (!IconSource){
                    return null
                }

                return (
                    <View style={styles.tabBarItemContainer}>
                        <View style={styles.tabBarIconContainer}>
                            <IconSource
                                color={focused ? '#8152E4' : '#808080'}
                                opacity={focused ? 1 : 0.8}
                            />
                        </View>
                        <Text style={[styles.tabBarTitle, focused && styles.tabBarTitleFocused]}>{ title }</Text>
                    </View>
                );
            },
            tabBarComponent: (props) => {
                return <TabBarComponent
                    {...props}
                />
            }
        }),
        initialRouteName: 'Dashboard',
        tabBarPosition: 'bottom',
        animationEnabled: true,
        swipeEnabled: true,
        tabBarOptions: {
            showIcon: true,
            showLabel: false,
            style: {
                backgroundColor: '#eeeeee'
            }
        }
    },
);
