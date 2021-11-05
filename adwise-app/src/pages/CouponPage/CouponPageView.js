import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView
} from "react-native";
import {
    OrganizationHeader as OrganizationHeaderComponent,
    CouponBody as CouponBodyComponent,
    Footer as FooterComponent
} from "./components";
import {
    DropDownHolder,
    ModalLoading, Page,
    RestrictedCoupon
} from "../../components";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import {hexToRGBA} from "../../helper/converting";
import getHeightStatusBar from "../../helper/getHeightStatusBar";
import {amplitudeLogEventWithPropertiesAsync} from "../../helper/Amplitude";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";
import SendShare from "../../helper/Share";
import getError from "../../helper/getErrors";
import {getMediaUrl} from "../../common/media";
import commonStyles from "../../theme/variables/commonStyles";

const heightStatusBar = getHeightStatusBar();

class CouponPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            coupon: {},
            organization: {},
            invitation: {},

            document: "",
            organizationColorOpacity: "#0084FF",

            isLoading: true,
            isError: false,
            isAgeRestricted: false,
            isModalLoading: false,
            isAgeMore: false
        }

        this.couponId = props?.navigation?.state?.params?.couponId;
        this.userId = props?.app?.account?._id;
    }

    componentDidMount = async () => {

        await this.initial();

    }

    initial = async () => {

        const coupon = await axios('get', `${urls["get-coupon"]}${this.couponId}`).then((response) => {
            return response.data.data.coupon;
        }).catch((error) => {
            return null
        });
        if (!coupon) {

            this.setState({isError: true});

            return null
        }

        const organization = await axios('get', `${urls["get-organization"]}${coupon.organization}`).then((response) => {
            return response.data.data.organization
        }).catch((error) => {
            return null
        })
        if (!organization) {

            this.setState({isError: true});

            return null
        }

        const document = await axios('get', `${ urls["legal-get-coupon-documents"] }/${ coupon?._id }`).then((res) => {
            const documents = res?.data?.data?.couponDocuments || [];
            const document = documents.find((doc) => doc.type === 'terms');

            if (!document){
                return null
            }

            return getMediaUrl(document.documentMedia)
        }).catch((error) => {
            return null
        });

        const invitation = await axios('post', urls["create-invitation"], {
            organizationId: organization?._id,
            couponId: this.couponId,
            userId: this.userId
        }).then((response) => {
            return response.data.data.invitation
        }).catch((error) => {
            return {}
        });

        const isAgeRestricted = Boolean(coupon?.ageRestricted);
        const organizationColorOpacity = hexToRGBA(organization?.colors?.primary, 0.7);


        this.setState({
            coupon,
            organization,
            invitation,

            document,
            organizationColorOpacity,

            isLoading: false,
            isAgeRestricted
        })
    }

    // Логика поделиться купоном
    onShareCoupon = async () => {
        const { account } = this.props.app;

        this.setState({ isModalLoading: true });

        await this._eventShareCoupon();

        const url = `${urls["web-site"]}/special/${this.state.invitation?.coupon}/${this.state.invitation?.ref?.code}`;
        const message = allTranslations(localization.commonUserSharedCoupon, {
            firstName: account?.firstName || '',
            lastName: account?.lastName || '',
            couponName: this.state.coupon?.name,
            url: url
        });

        await SendShare({
            message: message,
            url: url
        });

        this.setState({ isModalLoading: false });

    }

    // Логика покупки купона
    onBuyCoupon = async () => {

        this.setState({ isModalLoading: true });

        const { app } = this.props;
        const { coupon, organization } = this.state;
        const contactId = app?.activeCutaway || app?.account?.contacts?.[0]?._id;
        const defaultCashier = organization?.defaultCashier;

        const body = {
            purchaserContactId: contactId,
            cashierContactId: defaultCashier,
            couponId: coupon._id,
            description: 'Покупка из приложения'
        };

        const responseBuyCoupon = await axios('post', urls["create-purchase"], body).then((response) => {
            return response.data.data;
        }).catch((error) => {
           return {
               error: error.response
           }
        });

        if ( responseBuyCoupon.error ) {

            const errorMessage = getError(responseBuyCoupon.error);
            DropDownHolder.alert('error', errorMessage.title, errorMessage.message);

            this.setState({ isModalLoading: false });

            return null
        }

        this.props.navigation.navigate("PaymentPurchase", {
            purchaseId: responseBuyCoupon.purchaseId
        });

        this.setState({ isModalLoading: false });

    }

    _getInvitationUrl = (invitation) => {
        return `${urls["web-site"]}/special/${invitation?.coupon}/${invitation?.ref?.code}`
    }
    _isOrganizationSubscribe = () => {
        const { app } = this.props;
        const contactId = app?.activeCutaway || app?.account?.contacts?.[0]?._id;
        const contact = (app?.account?.contacts || []).find((t) => t._id === contactId);
        const organizationId = this.state.organization?._id;

        return Boolean((contact?.subscriptions || []).find((t) => t === organizationId));
    }
    _eventShareCoupon = async () => {

        await amplitudeLogEventWithPropertiesAsync('user-shared-coupon', {
            organizationId: this.state.coupon?.organization,
            couponId: this.state.coupon?._id,
            invitationId: this.state?.invitation?._id,
            userId: this.userId
        });

    }
    _routeGoBack = () => {
        this.props.navigation.goBack();
    }

    render() {
        const {
            coupon,
            document,
            organization,
            organizationColorOpacity,
            invitation,
            isLoading,
            isError,
            isAgeRestricted,
            isModalLoading,
            isAgeMore
        } = this.state;
        const isOrganizationSubscribe = this._isOrganizationSubscribe();
        const isFloating = Boolean(coupon.floating);

        if (isLoading) {
            return (
                <Page style={[styles.page, commonStyles.container, {marginTop: 60}]}>
                    <Text>{allTranslations(localization.commonLoadingMessage)}</Text>
                </Page>
            )
        }

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
                        invitationLink={this._getInvitationUrl(invitation)}

                        isAgeRestricted={isAgeRestricted}
                        isAgeMore={isAgeMore}
                        isFloating={isFloating}

                        onShareCoupon={this.onShareCoupon}
                        onBuyCoupon={this.onBuyCoupon}
                        onEventShareCoupon={this._eventShareCoupon}
                    />

                </View>

                <ModalLoading
                    isOpen={isModalLoading}
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

export default CouponPage

