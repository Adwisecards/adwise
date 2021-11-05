import React, {Component} from 'react';
import {
    View,
    Animated,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import {
    Header,
    MyCards,
    SectionsInformation
} from './components';
import {
    Page,
    ModalPersonal,
    HeaderControlsButtons,
    DropDownHolder,
    RefreshControl
} from '../../components';
import commonStyles from "../../theme/variables/commonStyles";
import queryString from 'query-string';
import {deleteItemAsync, getItemAsync} from "../../helper/SecureStore";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import * as Linking from "expo-linking";
import WS from 'react-native-websocket'
import {amplitudeLogEventWithPropertiesAsync} from "../../helper/Amplitude";
import variables from "../../constants/variables";
import getRefInitialUrl from "../../helper/GetRefInitialUrl";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const {width} = Dimensions.get("window");
const snapToInterval = width - 38;

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeCutaway: 0,
            idActiveCutaway: '',

            listMyBusinessCards: {
                work: [],
                personal: []
            },
            personalShare: null,

            openModalPersonalShare: false,

            isRefreshing: false,
            isErrorWebSocket: false,
            isSettingActiveBusinessCard: false
        }

        this.refMyCards = React.createRef();
        this.refSectionInformation = React.createRef();
        this.refRootSectionsInformation = React.createRef();

        this.timeOutUpdateActiveCutaway = null;
        this.intervalUpdateWallet = null;

        this.scrollX = new Animated.Value(0);
        this.activeCountCard = 0;
    }

    componentDidMount = async () => {
        clearInterval(this.intervalUpdateWallet);

        this.getUserWallet();
        this.intervalUpdateWallet = setInterval(() => {
            this.getUserWallet();
        }, 150000);

        const isEndRegistration = await getItemAsync('isEndRegistration');
        if (isEndRegistration) {
            this.props.navigation.navigate('Profile');
            await deleteItemAsync('isEndRegistration');
        }

        const url = await Linking.getInitialURL();
        await this.getInitialURL(url);
        await this.switchUrlApp(url);
        await Linking.addEventListener('url', (event) => {
            (async () => {
                await this.getInitialURL(event.url);
                await this.switchUrlApp(event.url);
                await amplitudeLogEventWithPropertiesAsync('start-app', {
                    url: event
                });
            })();
        });

        await amplitudeLogEventWithPropertiesAsync('start-app', {
            url: url
        });

        this.updateListMyBusinessCards();

        this.props.navigation.addListener('didFocus', () => {
            this.getUserWallet();
            this.updateListMyBusinessCards()
        });

        this.scrollX.addListener(({value}) => {
            const count = Math.ceil(value / snapToInterval);
            const newValue = value + (38 * count);

            this.refRootSectionsInformation?.current?.refScrollView?.current?.scrollTo({
                x: newValue,
                y: 0,
                animated: false,
                useNativeDriver: false
            })
        })
    }
    componentDidUpdate = async (prevProps) => {
        if (JSON.stringify(prevProps.app.account) !== JSON.stringify(this.props.app.account)) {
            this.updateListMyBusinessCards();
        }
    }

    getUserWallet = () => {
        axios('get', urls["user-get-wallet"]).then((response) => {
            const {wallet} = response.data.data;
            this.props.updateWallet(wallet);
        })
    }

    switchUrlApp = async (url) => {
        const mode = (variables.production_mode) ? 'prod' : 'develop';

        if (!url) {
            return null
        }

        let paramsLink = null;
        let path = null;
        let queryParams = null;

        if (mode === 'prod') {
            paramsLink = url.split('?');
            path = paramsLink[0].split('//')[1];
            queryParams = queryString.parse(paramsLink[1]);
        } else {
            paramsLink = url.split('?');
            path = paramsLink[0].split('/')[4];
            queryParams = queryString.parse(paramsLink[1]);
        }

        switch (path) {
            case 'getting-organization-coupon': {
                this.props.navigation.navigate('CompanyPageMain', {
                    organizationId: queryParams.organizationId,
                    invitation: queryParams.inviteId,

                    couponId: queryParams.couponId,

                    isNextCoupon: true
                });

                return null
            }
            case 'company-sign': {
                this.props.navigation.navigate('CompanyPageMain', {
                    organizationId: queryParams.organizationId,
                    invitation: queryParams.inviteId
                });

                return null
            }
            case 'cutaway': {
                this.props.navigation.navigate('PersonalExchaner', {
                    ref: queryParams.userId
                });

                return null
            }
            default: {
                return null
            }
        }
    }

    getInitialURL = async (initialURLApp) => {
        const params = await getRefInitialUrl(initialURLApp);

        if (!params) {
            if (initialURLApp.indexOf('adwise.cards') > -1) {
                await this.onInitUrlWeb(initialURLApp);
            }

            return null
        }

        if (params.mode === 'organization' && params.type === 'invitation') {
            await this.onOrganizationInvitation(params);

            return null
        }
        if (params.mode === 'organization' && params.type === 'subscription') {
            await this.onOrganizationSubscription(params);

            return null
        }
        if (params.mode === 'coupon' && params.type === 'purchase') {
            await this.onCouponPurchase(params);
        }
        if (params.mode === 'contact' && params.type === 'personal') {
            await this.onContactPersonal(params);

            return null
        }
        if (params.mode === 'contact' && params.type === 'work') {
            await this.onContactWork(params);

            return null
        }
    }
    onInitUrlWeb = async (url) => {
        const isCard = Boolean(url.indexOf('/card/') > -1);
        const isSpecial = Boolean(url.indexOf('/special/') > -1);
        const isOrganization = Boolean(url.indexOf('/organization/') > -1);

        if (isCard) {
            await this.onContactPersonal({ref: url.split('/').pop()});

            return null
        }
        if (isSpecial) {
            const params = url.split('/special/').pop().split('/');
            if (params[1]) {
                const ref = await axios('get', `${urls["get-ref"]}${params[1]}`).then((res) => {
                    return res.data.data.ref
                });

                await this.onOrganizationInvitation(ref);

                return null
            }
            const coupon = await axios('get', `${urls["get-coupon"]}${params[0]}`).then((res) => {
                return res.data.data.coupon
            });
            await this.onOrganizationSubscription({ref: coupon.organization._id || coupon.organization});
            return null
        }
        if (isOrganization) {
            const params = url.split('/organization/').pop().split('/');
            if (params[1]) {
                const ref = await axios('get', `${urls["get-ref"]}${params[1]}`).then((res) => {
                    return res.data.data.ref
                });

                await this.onOrganizationInvitation(ref);

                return null
            }
            await this.onOrganizationSubscription({ref: params[0]});
            return null
        }
    }
    onOrganizationInvitation = async (data) => {
        const organization = await axios('get', `${urls["get-organization-by-invitation"]}${data.ref}`).then((response) => {
            return response.data.data.organization
        }).catch((error) => {
            return null
        });
        if (!organization) {
            this.modalDropDown.current.alertWithType(
                'error',
                allTranslations(localization.dashboardErrorsOrganizationEmptyTitle),
                allTranslations(localization.dashboardErrorsOrganizationEmptyMessage),
                3000
            );

            return null
        }
        this.props.navigation.navigate('CompanyPageMain', {
            organizationId: organization._id,
            invitation: data.ref
        });
    }
    onOrganizationSubscription = async (data) => {
        this.props.navigation.navigate('CompanyPageMain', {
            organizationId: data.ref
        });
    }
    onCouponPurchase = async (data) => {
        const coupon = await axios('get', `${urls["get-coupon"]}${data.ref}`).then((response) => {
            return response.data.data.coupon
        }).catch(() => {
            return null
        });
        if (!coupon) {
            this.modalDropDown.current.alertWithType(
                'error',
                allTranslations(localization.dashboardErrorsCouponEmptyTitle),
                allTranslations(localization.dashboardErrorsCouponEmptyMessage),
                3000
            );

            return null
        }
        this.props.navigation.navigate('CompanyPageMain', {
            organizationId: coupon.organization,
            couponId: coupon._id,

            isNextCoupon: true
        });
    }
    onContactPersonal = async (data) => {
        this.props.navigation.navigate('PersonalExchaner', data);
    }
    onContactWork = async (data) => {
        this.props.navigation.navigate('PersonalExchaner', data);
    }

    updateListMyBusinessCards = () => {
        let listWork = []
        let listPersonal = []

        this.props.app.account.contacts.map(item => {
            if (item.type === 'work') {
                listWork.push(item)
            }
            if (item.type === 'personal') {
                listPersonal.push(item)
            }
        })

        let listMyBusinessCards = {
            'work': [...listWork],
            'personal': [...listPersonal]
        };

        this.setState({
            listMyBusinessCards
        })
    }

    onOpenShare = async (card) => {
        this.setState({
            openModalPersonalShare: true,
            personalShare: card
        })
    }
    onCloseShare = () => {
        this.setState({
            openModalPersonalShare: false,
            personalShare: null
        })
    }

    onChangeActiveCutaway = (index) => {
        const list = this.props.app?.account?.contacts || [];
        const cutaway = list[index];

        if (typeof index !== 'number') {
            return null
        }
        if (!Boolean(cutaway)) {
            return null
        }

        this.setState({isSettingActiveBusinessCard: true});
        clearTimeout(this.timeOutUpdateActiveCutaway);

        this.timeOutUpdateActiveCutaway = setTimeout(() => {
            const idActiveCutaway = cutaway._id;
            const activeCutaway = index;

            this.setState({activeCutaway});
            this.props.updateActiveCutaway(idActiveCutaway);

            this.setState({isSettingActiveBusinessCard: false});
        }, 200)
    }

    checkTransferSubscribeApp = async () => {
        const inviteCompanySign = await getItemAsync('invite-company-sign');

        if (inviteCompanySign) {
            const paramsInvite = inviteCompanySign.split(', ');

            let account = this.props.app.account;
            let accountId = this.props.app.activeCutaway;
            if (!accountId) {
                accountId = account.contacts[0]._id;
            }

            await deleteItemAsync('invite-company-sign');

            axios('put', urls["subscribe-to-organization"] + paramsInvite[1], {
                contactId: accountId
            }).then(async (response) => {
                this.onUpdateUser();
                DropDownHolder.alert('success', allTranslations(localization.notificationTitleSuccess), allTranslations(localization.dashboardNotificationCompanySubscription));
            }).catch(error => {
                console.log('er: ', error.response)
            })
        }
    }
    onUpdateUser = () => {
        axios('get', urls["get-me"]).then(response => {
            this.props.updateAccount(response.data.data.user);

            this.setState({isRefreshing: false})
        })
    }

    webSocketMessage = (message) => {
        const {id, type} = message;


        switch (type) {
            case 'init': {
                break
            }
            case 'contactRequest': {
                this.setState({isRefreshing: true});

                DropDownHolder.alert(
                    'info',
                    allTranslations(localization.dashboardNotificationContactRequestTitle),
                    allTranslations(localization.dashboardNotificationContactRequestMessage)
                );
                this.onUpdateUser();

                break
            }
            case 'purchaseAdded': {
                DropDownHolder.alert(
                    'info',
                    allTranslations(localization.dashboardNotificationPurchaseAddedTitle),
                    allTranslations(localization.dashboardNotificationPurchaseAddedMessage)
                );

                this.onUpdateUser();

                break
            }
            case 'purchaseConfirmed': {
                this.setState({isRefreshing: true});

                DropDownHolder.alert(
                    'info',
                    allTranslations(localization.dashboardNotificationPurchaseConfirmedTitle),
                    allTranslations(localization.dashboardNotificationPurchaseConfirmedMessage)
                );

                this.onUpdateUser();
            }

            default: {
                return null
            }
        }
    }

    onRefresh = () => {
        this.setState({isRefreshing: true});

        this.onUpdateUser();
    }

    onMomentumScrollEndCards = async (props) => {
        const value = props?.nativeEvent?.contentOffset?.x || 0;
        const count = Math.ceil(value / snapToInterval);

        this.onChangeActiveCutaway(count);
    }

    render() {
        const {isSettingActiveBusinessCard} = this.state;

        return (
            <Page style={styles.page}>
                <Header navigation={this.props.navigation} showHeader/>

                <ScrollView
                    contentContainerStyle={[commonStyles.container]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}

                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                >

                    <HeaderControlsButtons styleContainer={{marginBottom: 18}} {...this.props}/>

                    <View style={styles.cardsContainer}>
                        <MyCards
                            setRef={this.refMyCards}

                            list={this.state.listMyBusinessCards}
                            snapItem={this.state.activeCutaway}
                            onChangeSnap={this.onChangeActiveCutaway}
                            onOpenShare={this.onOpenShare}
                            idActiveCutaway={this.state.idActiveCutaway}

                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: this.scrollX } } }],
                                {useNativeDriver: true}
                            )}
                            onMomentumScrollEnd={this.onMomentumScrollEndCards}
                            {...this.props}
                        />
                    </View>

                    <SectionsInformation
                        isDisabled={isSettingActiveBusinessCard}

                        ref={this.refRootSectionsInformation}
                        setRef={this.refSectionInformation}

                        snapItem={this.state.activeCutaway}
                        list={this.state.listMyBusinessCards}

                        {...this.props}
                    />
                </ScrollView>

                <ModalPersonal
                    isOpen={this.state.openModalPersonalShare}
                    onClose={this.onCloseShare}

                    {...this.state.personalShare}
                />

                <WS
                    ref={ref => {
                        this.webSocket = ref
                    }}
                    url={`${urls["web-socket"]}${this.props.app.account._id}`}
                    onOpen={() => {
                        console.log('WS open')
                    }}
                    onMessage={(event) => {
                        const messages = JSON.parse(event.data);
                        this.webSocketMessage(messages)
                    }}
                    onError={(event) => {
                        // console.log('WS onError event: ', event)
                    }}
                    onClose={(event) => {
                        console.log('WS onClose event: ', event)
                    }}
                    reconnect
                />

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    cardsContainer: {
        marginHorizontal: -12,
        width: width,
        marginBottom: 16
    }
})

export default Dashboard
