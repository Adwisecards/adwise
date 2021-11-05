import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Dimensions,
    StyleSheet,
    TouchableOpacity, Share,
} from 'react-native';
import {
    Icon
} from 'native-base';
import {
    Page,
    DropDownHolder,
    ModalLoading,
    RestrictedCoupon
} from '../../../components';
import commonStyles from "../../../theme/variables/commonStyles";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import getError from "../../../helper/getErrors";
import {formatMoney} from "../../../helper/format";
import getHeightStatusBar from "../../../helper/getHeightStatusBar";
import * as Linking from "expo-linking";
import {amplitudeLogEventWithPropertiesAsync} from "../../../helper/Amplitude";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import SendShare from "../../../helper/Share";
import {getMediaUrl} from "../../../common/media";
import {hexToRGBA} from "../../../helper/converting";
import {
    CouponBody as CouponBodyComponent,
    Footer as FooterComponent,
    OrganizationHeader as OrganizationHeaderComponent
} from "./components";

const heightStatusBar = getHeightStatusBar();
const { height } = Dimensions.get('window');

const minHeightContainer = height - heightStatusBar - 160;

class OpenShareCompany extends Component {
    constructor(props) {
        super(props);

        this.state = {
            organization: null,
            invitation: null,
            defaultCashier: null,

            document: "",

            isLoadingContent: true,
            isLoading: false,
            isOpenInvitation: false,
            isCouponHide: false,
            isOpenAgeRestricted: true,
            isAgeMore: false
        };

        this.coupon = this.props.navigation.state.params.coupon;
        this.couponId = this.props.navigation.state.params.couponId;
        this.invitation = this.props.navigation.state.params.invitation;
        this.isLoadingCoupon = this.props.navigation.state.params.isLoadingCoupon;
    }

    componentDidMount = async () => {
        this.getInvitation();
        this.onLoadCouponsDisabled();

        if (!this.isLoadingCoupon) {
            this.onLoadOrganization();
            await this.getDocument();

            return null
        }

        this.onLoadCoupon();
    }

    onLoadCoupon = () => {
        axios('get', `${urls["get-coupon"]}${this.couponId}`).then((response) => {
            this.coupon = response.data.data.coupon;

            this.onLoadOrganization();

            ( async () => {
                await this.getDocument();
            })();
        })
    }
    getDocument = async () => {
        const document = await axios('get', `${ urls["legal-get-coupon-documents"] }/${ this.coupon?._id }`).then((res) => {
            const documents = res?.data?.data?.couponDocuments || [];
            const document = documents.find((doc) => doc.type === 'terms');

            if (!document){
                return null
            }

            return getMediaUrl(document.documentMedia)
        }).catch((error) => {
            return null
        });
        this.setState({ document });
    }

    onLoadCouponsDisabled = () => {
        axios('get', urls["get-user-hidden-coupons"]).then((response) => {
            const coupons = response.data.data.coupons;
            const couponID = this.couponId || this.coupon?._id;

            const isCouponHide = coupons.findIndex((t) => t._id === couponID) > -1;

            this.setState({
                isCouponHide,
                isLoading: false
            })
        })
    }

    onLoadOrganization = () => {
        axios('get', `${urls["get-organization"]}${this.coupon.organization}`).then((response) => {
            this.setState({
                organization: response.data.data.organization,
                defaultCashier: response.data.data.organization.defaultCashier,

                isLoadingContent: false
            })
        });
    }

    getCoupon = () => {
        this.setState({isLoading: true});

        let account = this.props.app.account;
        let accountId = this.props.app.activeCutaway;

        if (!accountId) {
            accountId = account.contacts[0]._id;
        }

        axios('put', urls["add-coupon-to-contact"] + this.coupon._id, {
            contactId: accountId
        }).then((response) => {
            this.updateAccount();

            (async () => {
                await amplitudeLogEventWithPropertiesAsync('adding-coupon-user', {
                    couponId: this.coupon._id,
                    contactId: accountId,
                    organizationId: this.state.organization._id
                })
            })();
        }).catch(error => {
            const errorMessage = getError(error.response);
            DropDownHolder.alert('error', errorMessage.title, errorMessage.message);
            this.setState({isLoading: false})
        })
    }
    buyCoupon = () => {
        let account = this.props.app.account;
        let activeCutaway = this.props.app.activeCutaway;
        let contact = {};

        if (activeCutaway) {
            contact = account.contacts.find(contact => contact._id === activeCutaway)
        } else {
            contact = account.contacts[0]
        }
        if (!contact) {
            DropDownHolder.alert(
                'error',
                allTranslations(localization.notificationTitleError),
                allTranslations(localization.companyPagesNoFoundActiveBusinessCard)
            );
            return null
        }

        const cashierContactId = this.state.defaultCashier;
        this.setState({isLoading: true});
        const body = {
            purchaserContactId: contact._id,
            cashierContactId: cashierContactId,
            couponId: this.coupon._id,
            description: 'Покупка из приложения'
        };

        axios('post', urls["create-purchase"], body).then((response) => {

            (async () => {
                await amplitudeLogEventWithPropertiesAsync('purchase-user-create', {
                    couponId: this.coupon._id,
                    contactId: contact._id,
                    userId: account._id,
                    organizationId: this.state.organization._id
                })
            })();

            this.setState({isLoading: false})
            this.props.navigation.push('PaymentPurchase', {
                purchaseId: response.data.data.purchaseId
            })

        }).catch((error) => {
            const errorBody = getError(error.response)
            this.setState({isLoading: false})
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        })
    }
    getInvitation = () => {
        const isAvailability = this._isAvailability();

        if (!isAvailability) {
            return null
        }

        let account = this.props.app.account;
        let accountId = this.props.app.activeCutaway;

        if (!accountId) {
            accountId = account.contacts[0]._id;
        }

        axios('post', urls["create-invitation"], {
            organizationId: this.coupon.organization,
            couponId: this.coupon._id,
            userId: accountId
        }).then(async (response) => {
            this.setState({
                invitation: response.data.data.invitation
            })
        }).catch((error) => {
            const errorMessage = getError(error.response);
            DropDownHolder.alert('error', errorMessage.title, errorMessage.message);
            this.setState({isLoading: false});

            return null
        })
    }

    updateAccount = () => {
        axios('get', urls["get-me"]).then((response) => {
            DropDownHolder.alert(
                'success',
                allTranslations(localization.notificationTitleSuccess),
                allTranslations(localization.companyPagesCouponAddFromUser)
            );
            this.props.updateAccount(response.data.data.user);
            this.setState({isLoading: false});

            this.getInvitation();
        }).catch((error) => {
            this.setState({isLoading: false});
        })
    }

    onShareLink = async () => {
        this.setState({isLoading: true})

        let account = this.props.app.account;
        let accountId = this.props.app.activeCutaway;

        if (!accountId) {
            accountId = account.contacts[0]._id;
        }

        axios('post', urls["create-invitation"], {
            organizationId: this.coupon.organization,
            couponId: this.coupon._id,
            userId: accountId
        }).then(async (response) => {
            const invitation = response.data.data.invitation;

            await amplitudeLogEventWithPropertiesAsync('user-shared-coupon', {
                organizationId: this.coupon.organization,
                couponId: this.coupon._id,
                invitationId: response.data.data.invitation._id,
                userId: accountId
            });

            const url = `${urls["web-site"]}/special/${invitation.coupon}/${invitation.ref.code}`;
            const message = allTranslations(localization.commonUserSharedCoupon, {
                firstName: account?.firstName || '',
                lastName: account?.lastName || '',
                couponName: this.coupon?.name,
                url: url
            });

            await SendShare({
                message: message,
                url: url
            });

            this.setState({
                isLoading: false
            })

        }).catch((error) => {
            const errorMessage = getError(error.response);
            DropDownHolder.alert('error', errorMessage.title, errorMessage.message);
            this.setState({isLoading: false});
        })
    }
    onShareQrCode = async () => {
        this.setState({isLoading: true});

        let account = this.props.app.account;
        let accountId = this.props.app.activeCutaway;

        if (!accountId) {
            accountId = account.contacts[0]._id;
        }

        const invitationData = await axios('post', urls["create-invitation"], {
            organizationId: this.coupon.organization,
            couponId: this.coupon._id,
            userId: accountId
        }).then(async (response) => {

            await amplitudeLogEventWithPropertiesAsync('user-shared-coupon', {
                organizationId: this.coupon.organization,
                couponId: this.coupon._id,
                invitationId: response.data.data.invitation._id,
                userId: accountId
            });

            return response.data.data.invitation
        }).catch((error) => {
            const errorMessage = getError(error.response);
            DropDownHolder.alert('error', errorMessage.title, errorMessage.message);
            this.setState({isLoading: false});

            return null
        })

        this.setState({
            invitation: invitationData,
            isOpenInvitation: true,
            isLoading: false
        })
    }

    onSubscribeOrganizationAndGetCoupon = async () => {
        this.setState({isLoading: true})

        let companyId = this.coupon.organization;
        let account = this.props.app.account;
        let accountId = this.props.app.activeCutaway;

        if (!accountId) {
            accountId = account.contacts[0]._id;
        }

        let body = {
            contactId: accountId,
        };
        if (this.invitation) {
            body['invitationId'] = this.invitation
        }

        axios('put', urls["subscribe-to-organization"] + companyId, body).then(async (response) => {
            this.getCoupon();
            this.updateAccount();
        }).catch((error) => {
            this.setState({isLoading: false});
            const errorBody = getError(error.response)
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        })
    }

    openDocument = (document) => {
        Linking.openURL(document);
    }

    onReturnCouponFromHidden = () => {
        this.setState({isLoading: true});

        const couponId = this.couponId || this.coupon?._id;

        axios('put', urls["remove-coupon-from-user-hidden-list"], {
            couponId
        }).then((response) => {
            this.onLoadCouponsDisabled();
        });
    }

    _routeGoBack = () => {
        this.props.navigation.goBack();
    }
    _routeContactOrganization = () => {
        this.props.navigation.navigate('ContactsCompany', {
            organizationId: this.state.organization?._id
        })
    }
    _isAvailability = () => {
        let account = this.props.app.account;
        let activeCutaway = this.props.app.activeCutaway;

        const contact = (!!activeCutaway) ? account.contacts.find((item) => item._id === activeCutaway) : account.contacts[0];

        return contact.coupons.indexOf(this.coupon?._id) > -1;
    }
    _isOrganizationSubscription = () => {
        let account = this.props.app.account;
        let activeCutaway = this.props.app.activeCutaway;

        const contact = (!!activeCutaway) ? account.contacts.find((item) => item._id === activeCutaway) : account.contacts[0];

        return contact.subscriptions.indexOf(this.coupon.organization) > -1;
    }

    render() {
        if (this.state.isLoadingContent) {
            return (
                <Page style={[styles.page, commonStyles.container, {marginTop: 60}]}>
                    <Text>{allTranslations(localization.commonLoadingMessage)}</Text>
                </Page>
            )
        }

        const { organization, isAgeMore, invitation } = this.state;
        const color = this.state.organization.colors.primary;
        const cashbackFirstLevel = this.coupon?.distributionSchema?.first || 0;
        const cashbackOtherLevel = this.coupon?.distributionSchema?.other || 0;
        const isAvailability = this._isAvailability();
        const isCouponHide = this.state.isCouponHide;
        const isOrganizationSubscription = this._isOrganizationSubscription();
        const isAgeRestricted = Boolean(this.coupon?.ageRestricted);
        const mainPictureMedia = organization?.mainPictureMedia || '';
        const organizationColorOpacity = hexToRGBA(organization?.colors?.primary, 0.7);
        const coupon = this.coupon;
        const document = this.state.document;
        const isFloating = Boolean(this.coupon.floating);

        return (
            <View style={[styles.root]}>

                {
                    Boolean(organization?.mainPictureMedia) && (
                        <Image
                            style={styles.imageOrganization}
                            source={{uri: getMediaUrl(organization?.mainPictureMedia)}}
                        />
                    )
                }

                <View style={[styles.container, {backgroundColor: organizationColorOpacity}]}>

                    <OrganizationHeaderComponent
                        organizationName={organization?.name}
                        organizationColor={organization?.colors?.primary}
                        organizationPicture={organization?.pictureMedia}
                    />


                    <ScrollView
                        contentContainerStyle={styles.scrollView}
                        scrollEnabled={!Boolean(isAgeRestricted && !isAgeMore)}
                    >

                        <CouponBodyComponent
                            picture={coupon?.pictureMedia}
                            couponName={coupon?.name}
                            couponDescription={coupon?.description}
                            couponDocument={document}

                            cashbackFirstLevel={coupon?.distributionSchema?.first || 0}
                            cashbackOtherLevel={coupon?.distributionSchema?.other || 0}
                        />

                        {
                            Boolean( isAgeRestricted && !isAgeMore ) && (
                                <RestrictedCoupon
                                    type={coupon?.ageRestricted || ''}

                                    onSubmit={() => this.setState({ isAgeMore: true })}
                                    onCancel={this._routeGoBack}
                                />
                            )
                        }

                    </ScrollView>


                    <FooterComponent
                        couponPrice={coupon.price}
                        cashback={coupon?.offer?.percent || 0}
                        organizationColor={organization?.colors?.primary}
                        organizationColorOpacity={organizationColorOpacity}
                        invitationQrCode={invitation?.ref?.QRCode || ''}

                        isOrganizationSubscription={isOrganizationSubscription}
                        isAgeRestricted={isAgeRestricted}
                        isAvailability={isAvailability}
                        isCouponHide={isCouponHide}
                        isAgeMore={isAgeMore}
                        isFloating={isFloating}

                        onShareCoupon={this.onShareLink}
                        onBuyCoupon={this.onBuyCoupon}

                        getCoupon={this.getCoupon}
                        buyCoupon={this.buyCoupon}
                        onReturnCouponFromHidden={this.onReturnCouponFromHidden}
                        routeContactOrganization={this._routeContactOrganization}
                        onSubscribeOrganizationAndGetCoupon={this.onSubscribeOrganizationAndGetCoupon}
                    />

                </View>

                <ModalLoading
                    isOpen={this.state.isLoading}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    container: {
        flex: 1,
        paddingTop: heightStatusBar
    },

    scrollView: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 12
    },

    imageOrganization: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 200,
        width: '100%',
        opacity: 0.6
    }
});

export default OpenShareCompany
