import React, {Component} from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    Page,
    ModalLoading,
    DropDownHolder,
    FormSendingTips,
    RefreshControl,
} from "../../../components";
import {
    Header as HeaderComponent,
    Footer as FooterComponent,
    LoadingPurchase as LoadingPurchaseComponent,
    HeaderBody as HeaderBodyComponent,
    ProductsTable as ProductsTableComponent,
    InformationsTable as InformationsTableComponent,
    BonusPayment as BonusPaymentComponent,
    FormComment as FormCommentComponent,
    Cashier as CashierComponent,
    RateYourOrder as RateYourOrderComponent,
    CashierServiceAssessment as CashierServiceAssessmentComponent,
    ModalCoupon as ModalCouponComponent
} from "./components";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import currencies from "../../../constants/currency";
import {amplitudeLogEventWithPropertiesAsync} from "../../../helper/Amplitude";
import * as Linking from "expo-linking";
import variables from "../../../constants/variables";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import {getMediaUrl} from "../../../common/media";

class PaymentPurchase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            purchase: {},
            employee: {},
            openCoupon: {},

            usedPoints: '',
            comment: '',

            isLoading: true,
            isError: false,
            isRefreshing: false,
            cashAvailable: false, // Доступна наличная оплата
            isOpenModalLoading: false,
            isOpenFormSendingTips: false,
            isPurchaseReviewSent: false,
            isCashierReviewSent: false
        };

        this.purchaseId = props.navigation.state.params.purchaseId;
        this.refModalCouponComponent = React.createRef();
    }

    componentDidMount = async () => {
        await this.getPurchase();
    }

    getPurchase = async () => {

        const {
            purchase,
            cashAvailable
        } = await axios('get', `${urls["get-purchase"]}${this.purchaseId}`).then((response) => {
            return response.data.data
        }).catch((error) => {
            return {}
        });

        if (!purchase) {
            this.setState({
                isError: true,
                isLoading: false,
                isRefreshing: false
            });

            return null
        }

        this.setState({
            purchase,
            cashAvailable,
            isLoading: false,
            isRefreshing: false,
            isPurchaseReviewSent: Boolean(!!purchase.review || (purchase?.rating || 0) > 0),
            isCashierReviewSent: Boolean(purchase.employeeRating)
        }, async () => {
            if (!purchase.employeeRating) {
                return null
            }

            const employee = await axios('get', `${urls["get-employee-rating"]}/${purchase.employeeRating}`).then((response) => {
                return response.data.data.employeeRating
            }).catch((error) => {
               return {}
            });

            this.setState({employee})
        })
    }

    // Выбор типа оплаты с последующей оплатой
    onPayPurchase = async (type) => {
        this.setState({isOpenModalLoading: true});

        const url = Boolean(type === 'online') ? urls['pay-purchase'] : urls['pay-purchase-with-cash'];
        const eventName = Boolean(type === 'online') ? 'purchase-user-pay' : 'purchase-user-pay-cash';

        const response = await axios('post', `${url}${this.purchaseId}`, {
            comment: this.state.comment,
            usedPoints: Number.parseFloat(this.state.usedPoints || '0')
        }).then((response) => {

            DropDownHolder.alert(
                'success',
                'Успешно',
                'Способ оплаты успешно выбран'
            );

            return response.data.data.payment
        }).catch((error) => {
            const message = error?.response?.data?.error?.details || 'Ошибка сервера';

            DropDownHolder.alert(
                'error',
                'Ошибка',
                message
            );

            return null
        });

        if (!response) {
            this.setState({isOpenModalLoading: false});

            return null
        }

        await amplitudeLogEventWithPropertiesAsync(eventName, {
            usedPoints: Number(this.state.usedPoints),
            purchase: this.purchaseId,
        });

        if (Boolean(type === 'online')) {
            await Linking.openURL(response.paymentUrl);
        }

        this.setState({isOpenModalLoading: false});

        this._routeGoBack();
    }

    // Отправка рейтинга и отзыва о заказе
    onSendOrderRate = async (form) => {
        this.setState({ isOpenModalLoading: true });

        // Оставление рейтинга к заказу
        const success = await axios('put', `${urls["add-review-to-purchase"]}${this.state.purchase._id}`, {
            review: form.comment,
            rating: form.rating
        }).then((res) => {
            return true
        }).catch((err) => {
            return false
        });

        if (!success) {
            this.setState({isOpenModalLoading: false});

            DropDownHolder.alert({
                title: "Ошибка системы",
                message: "Возникла ошибка при оставлении отзыва о заказе, попробуйте позднее.",
                type: "error"
            })

            return false
        }

        await this.getPurchase();

        this.setState({isOpenModalLoading: false});
    }
    // Отправка рейтинга и отзыва кассира
    onSendRatingFeedback = async (props) => {
        const { purchase } = this.state;

        this.setState({isOpenModalLoading: true});

        let form = {
            employeeContactId: purchase?.cashier?._id || purchase?.cashier || '',
            purchaserContactId: purchase.purchaser._id || purchase.purchaser,
            purchaseId: purchase._id
        };

        if (props.rating && props.rating > 0) {
            form.rating = props.rating;
        }
        if (props.comment) {
            form.comment = props.comment;
        }

        const response = await axios('post', urls['rating-create-employee-rating'], form).then((response) => {
            return response.data.data.employeeRating;
        }).catch((error) => {
            const message = error?.response?.data?.error?.details || 'Ошибка сервера';

            DropDownHolder.alert(
                'error',
                'Ошибка',
                message
            );

            return null
        })

        if (!response) {
            this.setState({isOpenModalLoading: false});

            return null
        }

        DropDownHolder.alert(
            'success',
            'Успешно',
            'Ваша оценка успешно отправлена'
        );

        await this.getPurchase();

        this.setState({isOpenModalLoading: false});
    }
    // Отправка чаевых кассиру
    onSendTips = async (body) => {
        this.setState({ isOpenModalLoading: true });

        body.userId = this.props.app.account._id;

        const paymentUrl = await axios('post', urls["tips-send-tips"], body).then((response) => {
            return response.data.data.payment.paymentUrl
        }).catch((error) => {
            return null
        });

        if (!paymentUrl) {
            this.setState({ isOpenModalLoading: false });

            DropDownHolder.alert('error', allTranslations(localization.notificationTitleSystemNotification), allTranslations(localization.paymentsNotificationsTipsError));

            return null
        }


        await Linking.openURL(paymentUrl);
    }

    _getMaxAmountPoints = () => {
        const {wallet} = this.props.app;
        const {purchase} = this.state;

        let sumInPoints = Math.floor(purchase?.sumInPoints);
        let maxAmountPoints = Math.floor(wallet?.points);

        if (sumInPoints <= maxAmountPoints) {
            maxAmountPoints = sumInPoints - 1;
        }

        return maxAmountPoints;
    }
    _getStatus = () => {
        const {purchase} = this.state;
        if (purchase.canceled) {
            return 'canceled'
        }
        if (!purchase.canceled && purchase.shared && purchase.confirmed && !purchase.complete) {
            return 'shared'
        }
        if (!purchase.canceled && purchase.confirmed && !purchase.complete) {
            return 'paid'
        }
        if (!purchase.canceled && !purchase.confirmed && !purchase.processing) {
            return 'not-paid'
        }
        if (!purchase.canceled && purchase.processing && !purchase.confirmed) {
            return 'during'
        }
        if (!purchase.canceled && purchase.confirmed && purchase.complete) {
            return 'completed'
        }
    }
    _routeGoBack = () => {
        this.props.navigation.goBack();
    }
    _sendMessageSupport = async () => {
        await Linking.openURL(`tg://resolve?domain=${variables["telegram-bot"]}&start=tgorg`);
    }
    _getDisabledOnline = () => {
        const { purchase } = this.state;
        let disabled = false;
        const coupons = purchase?.coupons || [];

        coupons.map((coupon) => {
           if (Boolean(coupon?.ageRestricted || '')) {
               disabled = true;
           }
        });

        return disabled
    }
    _openCoupon = (openCoupon) => {
        const { purchase } = this.state;
        const offerPercent = (purchase?.offers || []).find((t) => t.coupon === openCoupon._id)?.percent;
        this.refModalCouponComponent.current.open();

        this.setState({
            openCoupon: {
                ...openCoupon,
                offerPercent
            }
        })
    }

    render() {
        const {
            isLoading,
            purchase,
            employee,
            usedPoints,
            comment,
            openCoupon,
            cashAvailable,
            isOpenModalLoading,
            isOpenFormSendingTips,
            isPurchaseReviewSent,
            isCashierReviewSent
        } = this.state;
        const {app} = this.props;
        const {wallet} = app;
        const purchaseStatus = this._getStatus();
        const paymentType = purchase.type;
        const isTips = Boolean(purchase?.organization?.tips && purchase.tips);
        const isDisabledOnline = this._getDisabledOnline();

        if (isLoading) {
            return (
                <LoadingPurchaseComponent/>
            )
        }

        return (
            <Page>

                <HeaderComponent
                    status={purchaseStatus}
                    order={purchase?.ref?.code || ''}
                    goBack={this._routeGoBack}
                />

                <ScrollView
                    style={styles.container}
                    contentContainerStyle={{paddingHorizontal: 12, paddingVertical: 12}}

                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={async () => {this.setState({isRefreshing: true}); await this.getPurchase()}}
                        />
                    }
                >

                    <View style={styles.body}>

                        <HeaderBodyComponent
                            logo={getMediaUrl(purchase?.organization?.pictureMedia)}
                            name={purchase?.organization?.name}
                            color={purchase?.organization?.colors?.primary}

                            createdAt={purchase?.timestamp}
                            paidAt={purchase?.paidAt}
                            completedAt={purchase?.completedAt}
                        />

                        <ProductsTableComponent
                            initProducts={purchase?.coupons || []}
                            currency={currencies[purchase?.currency]}
                            onOpen={this._openCoupon}
                        />

                        <InformationsTableComponent
                            productsCount={(purchase?.coupons || []).length}
                            sumInPoints={purchase?.sumInPoints || 0}
                            currency={currencies[purchase?.currency]}
                            usedPoints={purchase?.usedPoints || 0}
                            cashback={purchase?.totalCashbackSum || 0} // Жду от Миши расчетов в покупке
                            order={purchase?.ref?.code || ''}
                            purchaseStatus={purchaseStatus}
                            qrCode={purchase?.ref?.QRCode}
                            isPurchaseReviewSent={isPurchaseReviewSent}
                            review={purchase.review}
                            rating={purchase.rating}
                            messageFromOrganization={purchase.description}
                        />

                        <BonusPaymentComponent
                            isHide={Boolean(purchaseStatus !== 'not-paid')}
                            points={Math.floor(wallet?.points) || 0}
                            usedPoints={usedPoints}
                            maxAmount={this._getMaxAmountPoints()}
                            onChange={(usedPoints) => this.setState({usedPoints})}
                        />

                        <FormCommentComponent
                            isHide={Boolean(purchaseStatus !== 'not-paid')}
                            value={comment}
                            onChange={(comment) => this.setState({comment})}
                        />

                        {
                            Boolean(purchaseStatus === 'completed' && !isPurchaseReviewSent) && (
                                <RateYourOrderComponent
                                    onSend={this.onSendOrderRate}
                                />
                            )
                        }

                        <TouchableOpacity onPress={this._sendMessageSupport}>
                            <Text style={styles.buttonTextSupport}>Сообщить о проблеме</Text>
                        </TouchableOpacity>

                    </View>

                    {
                        Boolean(purchaseStatus === 'completed' && !isCashierReviewSent) && (
                            <CashierComponent
                                cashier={purchase?.cashier || {}}
                                onSend={this.onSendRatingFeedback}
                            />
                        )
                    }

                    {
                        Boolean(isCashierReviewSent) && (
                            <CashierServiceAssessmentComponent
                                cashier={purchase?.cashier || {}}
                                employee={employee}
                            />
                        )
                    }

                </ScrollView>

                <FooterComponent
                    paymentType={paymentType}
                    purchaseStatus={purchaseStatus}
                    sumInPoints={purchase?.sumInPoints || 0}
                    productsCount={(purchase?.coupons || []).length}
                    currency={purchase?.currency || ''}
                    qrCode={purchase?.ref?.QRCode}
                    order={purchase?.ref?.code || ''}
                    cashAvailable={cashAvailable}
                    isDisabledOnline={isDisabledOnline}
                    onPayPurchase={this.onPayPurchase}
                    isSendTips={isTips}
                    usedPoints={purchase?.usedPoints || 0}
                    isOrganizationTips={purchase?.organization?.tips}
                    onSendTips={() => this.setState({isOpenFormSendingTips: true})}
                />

                <ModalLoading
                    isOpen={isOpenModalLoading}
                />

                <FormSendingTips
                    isOpen={isOpenFormSendingTips}
                    purchase={purchase}

                    onClose={() => this.setState({ isOpenFormSendingTips: false })}
                    onSendTips={this.onSendTips}
                />

                <ModalCouponComponent
                    innerRef={this.refModalCouponComponent}
                    coupon={openCoupon}
                />

            </Page>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    body: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12
    },

    buttonTextSupport: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 15,
        color: '#8152E4'
    }
});

export default PaymentPurchase
