import React, {Component} from 'react';
import {
    View,
    Text,
    Animated,
    Platform,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TouchableNativeFeedback
} from 'react-native';
import {
    Page,
    Header,
    PagesNavigations
} from '../components';
import {
    Subscribe,
    ListShares,
    ContactsList,
    SubscribeTop
} from './components';
import {
    DropDownHolder,
    ModalLoading
} from '../../../components';
import {amplitudeLogEventWithPropertiesAsync} from "../../../helper/Amplitude";
import commonStyles from "../../../theme/variables/commonStyles";
import moment from "moment";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import getError from "../../../helper/getErrors";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";


class MainScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            organization: null,
            coupons: [],
            employees: [],
            clients: [],


            isLoadingPage: true,
            isLoadingCoupons: true,
            isLoadingClients: true,
            isLoadingEmployees: true,
            companySubscription: false,
            isProgressSubscription: false,
            isDisabledPagesNavigations: true
        }

        this.scrollY = new Animated.Value(0);

        this.organizationId = this.props.navigation.state.params.organizationId;
        this.userId = this.props.navigation.state.params.userId;
        this.invitation = this.props.navigation.state.params.invitation;
        this.followingUserId = this.props.navigation.state.params.followingUserId;

        this.couponId = this.props.navigation.state.params.couponId;
        this.isNextCoupon = this.props.navigation.state.params.isNextCoupon;
    }

    componentDidMount = async () => {
        console.log('componentDidMount: ', this);

        if (this.couponId && this.isNextCoupon) {
            this.props.navigation.push('OpenShareCompany', {
                couponId: this.couponId,
                isLoadingCoupon: true
            })
        }

        await this.getCompany();
        this.companySubscriptionVerification();
    }
    componentDidUpdate = async (prevProps) => {
        let prevAccount = JSON.stringify(prevProps.app.account.contacts);
        let currentAccount = JSON.stringify(this.props.app.account.contacts);


        if (prevAccount !== currentAccount) {
            await this.getCompany();
            await this.updateAllData();
            this.companySubscriptionVerification();
        }
    }
    componentWillUnmount = () => {
        this.props.setCompany({})
    }

    getCompany = async () => {
        const organization = await axios('get', urls["get-organization"] + this.organizationId).then((response) => {
            return response.data.data.organization
        }).catch(error => {
            return null
        });

        this.props.setCompany(organization)
        this.setState({
            organization: organization,
            isLoadingPage: false
        }, async () => {
            await this.updateAllData();
        })
    }
    updateAllData = async () => {
        const urlCoupons = `${urls['get-coupons']}${this.organizationId}?limit=100`;
        const urlEmployees = `${urls['get-employees']}${this.organizationId}?limit=3`;
        const urlClients = `${urls['get-clients']}${this.organizationId}?limit=3`;

        const coupons = await axios('get', urlCoupons).then((res) => {
            return res.data.data
        });
        const employees = await axios('get', urlEmployees).then((res) => {
            return res.data.data
        });
        const clients = await axios('get', urlClients).then((res) => {
            return res.data.data
        });

        this.setState({
            coupons: coupons.coupons,
            employees: employees.employees,
            clients: clients.clients,

            couponsCount: coupons.count,
            employeesCount: employees.count,
            clientsCount: clients.count,

            isLoadingCoupons: false,
            isLoadingEmployees: false,
            isLoadingClients: false,
            isDisabledPagesNavigations: false
        });
    }

    loadContact = async () => {
        const account = await axios('get', urls["get-me"]).then(res => {
            return res.data.data.user
        });
        this.setState({isProgressSubscription: false});
        this.props.updateAccount(account)
    }
    companySubscriptionVerification = () => {
        const {app} = this.props;
        const {account, activeCutaway} = app;

        let contact = account.contacts[0];

        if (Boolean(!!activeCutaway)) {
            contact = account.contacts.find((t) => t._id === activeCutaway);
        }

        if (!contact) {
            return null
        }

        this.setState({
            companySubscription: contact.subscriptions.includes(this.organizationId)
        })
    }

    subscribeCompany = async () => {
        this.setState({isProgressSubscription: true})

        let companyId = this.organizationId;
        let account = this.props.app.account;
        let accountId = this.props.app.activeCutaway;

        if (!accountId) {
            accountId = account.contacts[0]._id;
        }

        let body = {
            contactId: accountId
        };

        if (this.userId) {

        }
        if (this.followingUserId) {
            body['followingUserId'] = this.followingUserId;
        }
        if (this.invitation) {
            body['invitationId'] = this.invitation
        }

        await amplitudeLogEventWithPropertiesAsync('user-subscribe-organization', {
            ...body,
            companyId,
            date: moment().format('DD.MM.YYYY HH:mm:ss')
        });

        axios('put', urls["subscribe-to-organization"] + companyId, body).then(async (response) => {
            await this.loadContact();
        }).catch((error) => {
            this.setState({isProgressSubscription: false});
            const errorBody = getError(error.response)
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        })
    }
    unsubscribeCompany = async () => {
        this.setState({isProgressSubscription: true})

        let companyId = this.organizationId;
        let account = this.props.app.account;
        let accountId = this.props.app.activeCutaway;

        if (!accountId) {
            accountId = account.contacts[0]._id;
        }

        await amplitudeLogEventWithPropertiesAsync('user-unsubscribe-organization', {
            contactId: accountId,
            companyId
        });

        axios('put', urls["unsubscribe-from-organization"] + companyId, {
            contactId: accountId
        }).then(async (response) => {
            await this.loadContact();
        }).catch((error) => {
            this.setState({isProgressSubscription: false});
            const errorBody = getError(error.response)
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        })
    }

    _routeShareCompany = () => {
        this.props.navigation.navigate('ShareCompany', {
            organizationId: this.organizationId,
            color: this.state.organization?.colors?.primary || "#0085FF"
        })
    }
    _routeOrders = () => {
        this.props.navigation.navigate('CreateMultiplePurchase', {
            organizationId: this.organizationId,
            defaultCashier: this.state.organization?.defaultCashier || "",
            organizationColor: this.state.organization?.colors?.primary || "#0085FF"
        });
    }

    _getHeaderBackgroundColor = () => {
        return this.scrollY.interpolate({
            inputRange: [0, 112],
            outputRange: ['rgba(0,0,0,0.0)', (this.state.organization) ? this.state.organization.colors.primary : 'rgba(0,0,0,0.0)'],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };
    _getHeaderImageOpacity = () => {
        return this.scrollY.interpolate({
            inputRange: [0, 112],
            outputRange: [1, 0],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };
    _getHeaderBigLogoOpacity = () => {
        return this.scrollY.interpolate({
            inputRange: [0, 112],
            outputRange: [140, 50],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };
    _getHeaderHeight = () => {
        return this.scrollY.interpolate({
            inputRange: [-360, 0, 112],
            outputRange: [560, 200, 100],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };

    render() {
        const {couponsCount, employeesCount, clientsCount, organization} = this.state;
        const color = (this.state.organization) ? this.state.organization.colors.primary : null;
        const isDisabled = (!!this.state.organization) ? this.state.organization.disabled : false;
        const defaultCashier = organization?.defaultCashier;
        const isSubscription = this.state.companySubscription;

        const headerBackgroundColor = this._getHeaderBackgroundColor();
        const headerImageOpacity = this._getHeaderImageOpacity();
        const headerBigLogoOpacity = this._getHeaderBigLogoOpacity();
        const headerHeight = this._getHeaderHeight();

        if (this.state.isLoadingPage) {
            return (
                <Page style={styles.page} color={color}>
                    <Header
                        scrollPosition={this.state.scrollPosition}
                        color={color}
                        navigation={this.props.navigation}

                        headerBackgroundColor={headerBackgroundColor}
                        headerImageOpacity={headerImageOpacity}
                        headerHeight={headerHeight}
                        headerBigLogoOpacity={headerBigLogoOpacity}
                    />

                    <View style={[commonStyles.container, {paddingTop: 120}]}>
                        <Text>{allTranslations(localization.companyPagesTextLoading)}</Text>
                    </View>
                </Page>
            )
        }

        return (
            <Page style={styles.page} color={color}>
                <Header
                    scrollPosition={this.state.scrollPosition}
                    color={color}
                    navigation={this.props.navigation}

                    organization={this.state.organization}

                    isDisabled={isDisabled}

                    headerBackgroundColor={headerBackgroundColor}
                    headerImageOpacity={headerImageOpacity}
                    headerHeight={headerHeight}
                    headerBigLogoOpacity={headerBigLogoOpacity}
                />

                <Animated.ScrollView
                    overScrollMode={'never'}
                    scrollEventThrottle={16}

                    contentContainerStyle={[commonStyles.container, {paddingTop: 112}]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}

                    onEndReachedThreshold={0.2}

                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {contentOffset: {y: this.scrollY}}
                            }
                        ]
                    )}
                >
                    {
                        !isDisabled && (
                            <PagesNavigations
                                active={0}
                                color={color}
                                organizationId={this.organizationId}
                                isDisable={this.state.isDisabledPagesNavigations}
                                {...this.props}
                            />
                        )
                    }

                    <View style={styles.contentInformation}>
                        <Text style={styles.informationTitle}>{this.state.organization?.name || ''}</Text>
                        <Text style={styles.informationDescription}>{this.state.organization.briefDescription}</Text>

                        {
                            Boolean(isSubscription && !isDisabled) && (
                                <ButtonShare color={color} onPress={this._routeShareCompany}/>
                            )
                        }

                        {
                            Boolean(!isSubscription && !isDisabled) && (
                                <ButtonSubscribe color={color} onPress={this.subscribeCompany}/>
                            )
                        }

                        {
                            isDisabled && (
                                <View style={styles.contentInformationDisabled}>
                                    <Text style={styles.contentInformationDisabledTitle}>{allTranslations(localization.commonOrganizationDisabled)}</Text>
                                </View>
                            )
                        }
                    </View>

                    {
                        !isDisabled && (
                            <>

                                <View style={{marginBottom: 32}}>
                                    <ListShares
                                        coupons={this.state.coupons}
                                        color={color}
                                        organizationId={this.organizationId}
                                        invitation={this.invitation}
                                        countCoupons={couponsCount}
                                        isLoading={this.state.isLoadingCoupons}
                                        {...this.props}
                                    />

                                    {
                                        isSubscription && (
                                            <ButtonOrders color={color} onPress={this._routeOrders}/>
                                        )
                                    }
                                </View>

                                <ContactsList
                                    color={color}
                                    title={allTranslations(localization.companyPagesStaff)}
                                    url={`${urls['get-employees']}${this.organizationId}`}
                                    contacts={this.state.employees}
                                    countContacts={this.state.organization.employees.length}
                                    isLoading={this.state.isLoadingEmployees}
                                    companyName={this.state.organization?.name || ''}

                                    {...this.props}
                                />

                                <ContactsList
                                    color={color}
                                    title={allTranslations(localization.companyPagesClients)}
                                    url={`${urls['get-clients']}${this.organizationId}`}
                                    contacts={this.state.clients}
                                    countContacts={clientsCount}
                                    isLoading={this.state.isLoadingClients}
                                    companyName={this.state.organization?.name || ''}

                                    {...this.props}
                                />

                                {
                                    isSubscription && (
                                        <View style={{ marginBottom: 16, marginTop: -8 }}>
                                            <ButtonUnsubscribe onPress={this.unsubscribeCompany} color={color}/>
                                        </View>
                                    )
                                }
                            </>
                        )
                    }

                </Animated.ScrollView>

                {
                    (isDisabled && this.state.companySubscription) && (
                        <View style={styles.footerDisabled}>

                            <TouchableOpacity style={styles.buttonUnsubscribe} onPress={this.unsubscribeCompany}>
                                <Text style={styles.buttonUnsubscribeText}>{allTranslations(localization.commonUnsubscribe)}</Text>
                            </TouchableOpacity>

                        </View>
                    )
                }

                <ModalLoading
                    isOpen={this.state.isProgressSubscription}
                />
            </Page>
        );
    }
}

const ButtonSubscribe = (props) => {
    const {color, onPress} = props;
    const Button = Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;

    return (
        <Button onPress={onPress}>
            <View style={[styles.buttonContained, {backgroundColor: color}]}>
                <Text style={styles.buttonContainedText}>{allTranslations(localization.commonSubscribe)}</Text>
            </View>
        </Button>
    )
}
const ButtonShare = (props) => {
    const {color, onPress} = props;
    const Button = Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;

    return (
        <Button onPress={onPress}>
            <View style={[styles.buttonOutline, {borderColor: color}]}>
                <Text style={[styles.buttonOutlineText, {color: color}]}>{allTranslations(localization.commonShare)}</Text>
            </View>
        </Button>
    )
}
const ButtonOrders = (props) => {
    const {color, onPress} = props;
    const Button = Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;

    return (
        <Button onPress={onPress}>
            <View style={[styles.buttonContained, {backgroundColor: color}]}>
                <Text style={styles.buttonContainedText}>{allTranslations(localization.companyPagesCreateOrder)}</Text>
            </View>
        </Button>
    )
}
const ButtonUnsubscribe = (props) => {
    const {color, onPress} = props;

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={onPress} style={{ paddingVertical: 4, paddingHorizontal: 8 }}>
                <Text style={[styles.buttonLinkText, {color: color}]}>{allTranslations(localization.commonUnsubscribe)}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    contentInformation: {
        padding: 18,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 30,
        overflow: 'hidden'
    },
    informationTitle: {
        fontSize: 24,
        lineHeight: 26,
        marginBottom: 12,
        fontFamily: 'AtypText_medium'
    },
    informationDescription: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 22,
        opacity: 0.6,
        marginBottom: 16,
    },

    contentInformationDisabled: {
        backgroundColor: '#ff6666',
        padding: 16,

        marginLeft: -18,
        marginRight: -18,
        marginBottom: -18,
    },
    contentInformationDisabledTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: 'white'
    },

    footerDisabled: {
        flex: 1,

        justifyContent: 'flex-end',

        paddingHorizontal: 12,
        paddingVertical: 16
    },

    buttonUnsubscribe: {
        paddingVertical: 10,

        borderRadius: 10,
        backgroundColor: '#0085FF'
    },
    buttonUnsubscribeText: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: 'white',
        textAlign: 'center'
    },

    buttonOutline: {
        height: 40,
        width: '100%',

        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 10,

        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonOutlineText: {
        fontFamily: 'AtypText',
        fontSize: 20,
        lineHeight: 22
    },

    buttonContained: {
        height: 42,
        width: '100%',

        borderRadius: 10,

        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainedText: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: 'white'
    },

    buttonLinkText: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 15,

        paddingVertical: 4
    },
})

export default MainScreen
