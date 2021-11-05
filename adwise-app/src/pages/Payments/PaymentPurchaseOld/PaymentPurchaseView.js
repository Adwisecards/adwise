import React, {Component, useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    DropDownHolder,
    Page,
    Input,
    ModalLoading,
    FormSendingTips,
    RefreshControl
} from "../../../components";
import {
    Icon
} from 'native-base';
import {
    PaymentPurchase as PaymentPurchaseIcon, PersonalSmallCard,
    RatingStar as RatingStarIcon
} from '../../../icons';
import * as Linking from 'expo-linking';
import {
    Confirmed,
    TableProducts,
    PurchaseBonuses,
    PurchaseInformation
} from './components';
import Star from 'react-native-star-view';
import commonStyles from "../../../theme/variables/commonStyles";
import getHeightStatusBar from "../../../helper/getHeightStatusBar";
import axios from "../../../plugins/axios";
import Dash from "react-native-dash";
import urls from "../../../constants/urls";
import getError from "../../../helper/getErrors";
import {formatMoney} from "../../../helper/format";
import WS from "react-native-websocket";
import moment from "moment";
import {amplitudeLogEventWithPropertiesAsync} from "../../../helper/Amplitude";
import imageButtonWallet from "../../../../assets/graphics/wallet/wallet_button.png";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import variables from "../../../constants/variables";

const heightStatusBar = getHeightStatusBar();

class PaymentPurchase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            purchase: null,

            review: '',
            comment: '',

            countBonuses: 0,
            rating: 0,


            isError: false,
            isLoading: true,
            isSubmit: false,
            isUpdateUser: false,
            cashAvailable: false,
            isLeaveTip: false,
            isRefreshing: false
        }

        this.idDeal = this.props.navigation.state.params.purchaseId;
        this.timeoutUpdatePage = null;
    }

    componentDidMount = () => {
        this.onLoadDeal();

        this.props.navigation.addListener('didFocus', () => {
            this.onLoadDeal();

            this.timeoutUpdatePage = setInterval(() => {
                this.onLoadDeal();
            }, 10000);
        });
    }

    onLoadDeal = () => {
        const isFocused = this.props.navigation.isFocused();

        if (!isFocused) {
            clearInterval(this.timeoutUpdatePage);

            return null
        }

        axios('get', `${urls["get-purchase"]}${this.idDeal}`).then((response) => {
            this.setState({
                purchase: response.data.data.purchase,
                cashAvailable: response.data.data.cashAvailable,

                isLoading: false,
                isSubmit: false,
                isRefreshing: false
            });
        }).catch((error) => {
            const errorBody = getError(error.response);
            DropDownHolder.alert('error', errorBody.title, errorBody.message);

            this.setState({
                isError: true,
                isLoading: false
            })
        })
    }

    onMakeDeal = () => {
        this.setState({isSubmit: true});

        axios('post', `${urls["pay-purchase"]}${this.idDeal}`, {
            usedPoints: Number(this.state.countBonuses),
            comment: this.state.comment
        }).then((response) => {
            this.onSendCommentPurchase();

            Linking.openURL(response.data.data.payment.paymentUrl);

            (async () => {
                await amplitudeLogEventWithPropertiesAsync('purchase-user-pay', {
                    usedPoints: Number(this.state.countBonuses),
                    purchase: this.state.purchase._id,
                })
            })();

            this.setState({
                isSubmit: false
            })

            this.props.navigation.goBack();
        }).catch((error) => {
            const errorBody = getError(error.response);
            DropDownHolder.alert('error', errorBody.title, errorBody.message);

            this.setState({
                isSubmit: false
            })
        })
    }
    onMakeDealCash = () => {
        this.setState({isSubmit: true});

        axios('post', `${urls["pay-purchase-with-cash"]}${this.idDeal}`, {
            usedPoints: Number(this.state.countBonuses),
            comment: this.state.comment
        }).then((response) => {
            DropDownHolder.alert(
                'success',
                allTranslations(localization.notificationTitleSystemNotification),
                allTranslations(localization.paymentsSuccessCashPurchase)
            );

            (async () => {
                await amplitudeLogEventWithPropertiesAsync('purchase-user-pay-cash', {
                    usedPoints: Number(this.state.countBonuses),
                    purchase: this.state.purchase._id,
                })
            })();

            this.onSendCommentPurchase();

            this.setState({
                isSubmit: false
            })

            this.onLoadDeal();
        }).catch((error) => {
            const errorBody = getError(error.response);
            DropDownHolder.alert('error', errorBody.title, errorBody.message);

            this.setState({
                isSubmit: false
            })
        })
    }

    onSendCommentPurchase = () => {
        if (!this.state.comment) {
            return null
        }

        axios('put', `${urls["add-comment-to-purchase"]}${this.state.purchase._id}`, {
            comment: this.state.comment
        })
    }

    onChangeCountBonuses = (countBonuses) => {
        this.setState({countBonuses})
    }

    onSendRevievPurchase = () => {
        this.setState({isSubmit: true});

        let body = {};

        if (!!this.state.review) {
            body.review = this.state.review;
        }
        if (!!this.state.rating) {
            body.rating = this.state.rating;
        }

        axios('put', `${urls["add-review-to-purchase"]}${this.state.purchase._id}`, body).then((response) => {
            DropDownHolder.alert(
                'success',
                allTranslations(localization.notificationTitleSystemNotification),
                allTranslations(localization.purchaseSuccessCommentSend)
            );

            this.onLoadDeal();
        }).catch((error) => {
            const errorBody = getError(error.response);
            this.setState({isSubmit: false});
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        });
    }

    onCreateEmployeeRating = (body) => {
        this.setState({
            isModalLoading: true
        });

        axios('post', urls["rating-create-employee-rating"], body).then((response) => {
            this.setState({
                isModalLoading: false,
                isLeaveTip: false,
            });

            DropDownHolder.alert('success', allTranslations(localization.notificationTitleSystemNotification), allTranslations(localization.paymentsNotificationsReviewedSuccessfully));
        }).catch((error) => {
            this.setState({
                isModalLoading: false,
                isLeaveTip: false,
            });

            DropDownHolder.alert('error', allTranslations(localization.notificationTitleSystemNotification), allTranslations(localization.paymentsNotificationsReviewedError));
        })
    }
    onSendTips = (body) => {
        this.setState({ isModalLoading: true });

        body.userId = this.props.app.account._id;

        axios('post', urls["tips-send-tips"], body).then((response) => {
            const { paymentUrl } = response.data.data.payment;

            Linking.openURL(paymentUrl);
        }).catch((error) => {
            console.log('error: ', error)

            DropDownHolder.alert('error', allTranslations(localization.notificationTitleSystemNotification), allTranslations(localization.paymentsNotificationsTipsError));
        })
    }

    onRefresh = () => {
        this.setState({
            isRefreshing: true
        }, () => {
           this.onLoadDeal();
        })
    }

    _routeGoBack = () => {
        this.props.navigation.goBack();
    }
    _routePageWallet = () => {
        Linking.openURL(`${ urls["prod-host"] }${ urls["wallet-purchase-pass"] }${ this.state.purchase._id }`);
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Page style={[styles.page, {marginTop: heightStatusBar}, commonStyles.container]}>
                    <View style={styles.container}>
                        <Text style={styles.title}>{ allTranslations(localization.purchaseTextLoading) }</Text>
                    </View>
                </Page>
            )
        }
        if (this.state.isError) {
            return (
                <Page style={[styles.page, {marginTop: heightStatusBar}, commonStyles.container]}>
                    <View style={styles.container}>
                        <Text style={styles.title}>{ allTranslations(localization.purchaseOrderNotFound) }</Text>
                    </View>
                </Page>
            )
        }

        const { purchase } = this.state;
        const totalPrice = this.state.purchase.sumInPoints;
        const isConfirmed = this.state.purchase.confirmed;
        const isProcessing = this.state.purchase.processing && !this.state.purchase.confirmed;
        const isCompleted = (this.state.purchase.confirmed && this.state.purchase.complete);
        const isTips = Boolean(!purchase.tips && isCompleted && purchase.organization.tips);
        const isShowWallet = Boolean((Platform.OS === 'ios') && isConfirmed && !isCompleted);

        return (
            <Page style={[styles.page, {paddingTop: heightStatusBar}]}>
                <ScrollView
                    style={{flex: 1}}

                    contentContainerStyle={[commonStyles.container]}

                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                >
                    <View style={styles.container}>

                        <View style={styles.header}>
                            <TouchableOpacity style={styles.buttonClose} onPress={this._routeGoBack}>
                                <Icon name="x" type="Feather" style={{fontSize: 25, color: '#CBCCD4'}}/>
                            </TouchableOpacity>

                            <View style={styles.logoContainer}>
                                <PaymentPurchaseIcon style={{marginLeft: 8, marginTop: 4}}/>
                            </View>

                            <Text style={styles.title}>{isConfirmed ? allTranslations(localization.purchasePurchaseData) : allTranslations(localization.purchasePurchasePayment)}</Text>

                            <Text style={[
                                styles.billStatus,

                                (this.state.purchase.confirmed && !this.state.purchase.complete) && styles.billStatusConfirmed,
                                (!this.state.purchase.confirmed && !this.state.purchase.processing) && styles.billStatusNotConfirmed,
                                (this.state.purchase.processing && !this.state.purchase.confirmed) && styles.billStatusProcessing,
                                (this.state.purchase.confirmed && this.state.purchase.complete) && styles.billStatusConfirmed,
                            ]}>
                                {(this.state.purchase.confirmed && !this.state.purchase.complete) && allTranslations(localization.purchaseStatusPaid)}
                                {(!this.state.purchase.confirmed && !this.state.purchase.processing) && allTranslations(localization.purchaseStatusNotPaid)}
                                {(this.state.purchase.processing && !this.state.purchase.confirmed) && allTranslations(localization.purchaseStatusDuring)}
                                {(this.state.purchase.confirmed && this.state.purchase.complete) && allTranslations(localization.purchaseStatusCompleted)}
                            </Text>

                            {
                                isShowWallet && (
                                    <View style={{ width: 130, height: 40, marginTop: -12, justifyContent: 'center', alignItems: 'center', marginBottom: 18 }}>
                                        <TouchableOpacity
                                            style={styles.buttonWallet}
                                            onPress={this._routePageWallet}
                                        >
                                            <Image
                                                style={{ flex: 1, width: 110 }}
                                                source={imageButtonWallet}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )
                            }

                            <View style={{width: '100%'}}>
                                {(!!this.state.purchase && !!this.state.purchase.purchaser) && (
                                    <View style={styles.textDateContainer}>
                                        <Text style={styles.textDateTime}>{ allTranslations(localization.purchaseCreatedBy) }</Text>
                                        <View style={{flex: 1, marginBottom: 4, marginLeft: 4, marginRight: 4}}>
                                            <Dash
                                                dashGap={1}
                                                dashLength={1}
                                                dashThickness={1}
                                                style={styles.textDateDash}
                                                dashStyle={{borderRadius: 100}}
                                                dashColor={'#999DB1'}
                                            />
                                        </View>
                                        <Text
                                            style={styles.textDateTime}>{moment(this.state.purchase.timestamp).format('DD.MM.YYYY / HH:mm')}</Text>
                                    </View>
                                )}
                                {(!!this.state.purchase && !!this.state.purchase.paidAt) && (
                                    <View style={styles.textDateContainer}>
                                        <Text style={styles.textDateTime}>{ allTranslations(localization.purchasePaidBy) }</Text>
                                        <View style={{flex: 1, marginBottom: 4, marginLeft: 4, marginRight: 4}}>
                                            <Dash
                                                dashGap={1}
                                                dashLength={1}
                                                dashThickness={1}
                                                style={styles.textDateDash}
                                                dashStyle={{borderRadius: 100}}
                                                dashColor={'#999DB1'}
                                            />
                                        </View>
                                        <Text
                                            style={styles.textDateTime}>{moment(this.state.purchase.paidAt).format('DD.MM.YYYY / HH:mm')}</Text>
                                    </View>
                                )}
                                {(!!this.state.purchase && !!this.state.purchase.completedAt) && (
                                    <View style={styles.textDateContainer}>
                                        <Text style={styles.textDateTime}>{ allTranslations(localization.purchaseCompletedBy) }</Text>
                                        <View style={{flex: 1, marginBottom: 4, marginLeft: 4, marginRight: 4}}>
                                            <Dash
                                                dashGap={1}
                                                dashLength={1}
                                                dashThickness={1}
                                                style={styles.textDateDash}
                                                dashStyle={{borderRadius: 100}}
                                                dashColor={'#999DB1'}
                                            />
                                        </View>
                                        <Text
                                            style={styles.textDateTime}>{moment(this.state.purchase.completedAt).format('DD.MM.YYYY / HH:mm')}</Text>
                                    </View>
                                )}
                            </View>

                        </View>

                        <TableProducts purchase={this.state.purchase}/>

                        <PurchaseInformation
                            purchase={this.state.purchase}
                        />

                        {
                            (!isConfirmed) && (
                                <PurchaseBonuses
                                    purchase={this.state.purchase}
                                    countBonuses={this.state.countBonuses}
                                    propsData={this.props}

                                    onChangeCountBonuses={this.onChangeCountBonuses}
                                />
                            )
                        }

                        {
                            (!isConfirmed) && (
                                <View>

                                    <View style={{marginBottom: 32}}>
                                        <Text style={styles.commentTitle}>{ allTranslations(localization.purchaseCommentTitle) }</Text>

                                        <Input
                                            value={this.state.comment}

                                            multiline

                                            placeholder={ allTranslations(localization.purchaseCommentPlaceholder) }

                                            onChangeText={(comment) => this.setState({comment})}
                                        />

                                    </View>

                                    <View style={{alignItems: 'center'}}>
                                        <FooterControls
                                            purchase={this.state.purchase}
                                            sum={formatMoney(totalPrice - this.state.countBonuses)}
                                            cashAvailable={this.state.cashAvailable}
                                            isProcessing={isProcessing}

                                            onMakeDeal={this.onMakeDeal}
                                            onMakeDealCash={this.onMakeDealCash}
                                        />
                                    </View>

                                </View>
                            )
                        }

                        {
                            isCompleted && (
                                <CashierInformation
                                    purchase={this.state.purchase}

                                    isCompleted={isCompleted}
                                />
                            )
                        }

                        {
                            (isConfirmed) && (
                                <Confirmed purchase={this.state.purchase}/>
                            )
                        }

                        {
                            (isConfirmed && isCompleted) && (
                                <ProductEvaluation
                                    review={this.state.review}
                                    rating={this.state.rating}

                                    purRating={this.state.purchase.rating}
                                    purReview={this.state.purchase.review}

                                    onChangeRating={(rating) => this.setState({rating})}
                                    onSendRating={this.onSendRevievPurchase}
                                    onChangeReview={(review) => this.setState({review})}
                                />
                            )
                        }




                        {
                            isTips && (
                                <TouchableOpacity style={styles.buttonOpenTips} onPress={() => this.setState({ isLeaveTip: true })}>
                                    <Text style={styles.buttonOpenTipsText}>{ allTranslations(localization.commonLeaveTip) }</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>

                </ScrollView>

                <ModalLoading
                    isOpen={this.state.isSubmit}
                />

                <WS
                    ref={ref => {
                        this.webSocket = ref
                    }}
                    url={`${urls["web-socket"]}${this.props.app.account._id}`}
                    onMessage={(event) => {
                        const messages = JSON.parse(event.data);

                        if (messages.type === 'purchaseConfirmed') {
                            this.onLoadDeal();
                        }
                        if (messages.type === 'purchaseCreated') {
                            this.onLoadDeal();
                        }
                        if (messages.type === 'purchaseCompleted') {
                            this.onLoadDeal();
                        }
                    }}
                    reconnect
                />



                <FormSendingTips
                    isOpen={this.state.isLeaveTip}
                    purchase={this.state.purchase}

                    onClose={() => this.setState({ isLeaveTip: false })}
                    onCreateEmployeeRating={this.onCreateEmployeeRating}
                    onSendTips={this.onSendTips}
                />
            </Page>
        );
    };
}

const CashierInformation = (props) => {
    const {purchase, isCompleted} = props;
    const { cashier } = purchase;

    if (!isCompleted) {
        return null
    }

    const handleOpenPageCashier = () => {
        Linking.openURL(`https://adwise.cards/tips/${ cashier.ref }`);
    }

    const isPicture = Boolean(cashier?.picture?.value);

    return (
        <View style={styles.sectionsCashier}>
            <View style={styles.sectionsCashierBody}>
                <View style={styles.sectionsCashierBodyLeft}>
                    <View style={[styles.sectionsCashierLogoContainer, isPicture && { padding: 3 }]}>
                        {
                            isPicture ? (
                                <Image
                                    style={{ flex: 1, borderRadius: 999, backgroundColor: '#8152E4' }}
                                    source={{ uri: cashier.picture.value }}
                                />
                            ) : (
                                <PersonalSmallCard style={{ margin: -2 }} width={80} height={80} color="#8152E4"/>
                            )
                        }
                    </View>
                </View>
                <View style={styles.sectionsCashierBodyRight}>
                    <Text style={styles.sectionsCashierTitle}>{allTranslations(localization.purchaseCashierTitle)}</Text>

                    <Text style={styles.sectionsCashierUserName}>{ cashier?.firstName?.value || '' }</Text>
                    <Text style={styles.sectionsCashierUserName}>{ cashier?.lastName?.value || '' }</Text>
                </View>
                <View style={styles.sectionsCashierBodyArrow}>
                    <TouchableOpacity
                        style={styles.sectionsCashierButtonGo}
                        onPress={handleOpenPageCashier}
                    >
                        <Icon
                            name="arrow-right"
                            type="Feather"
                            style={{ color: '#8152E4' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
const FooterControls = (props) => {
    const {sum, purchase, isProcessing, onMakeDeal, onMakeDealCash, cashAvailable} = props;

    const isCashPayment = purchase.type === "cash";

    const handleSendReportIssue = () => {
        Linking.openURL(`tg://resolve?domain=${variables["telegram-bot"]}&start=tgorg`);
    }

    return (
        <View style={styles.footerControls}>

            <Text style={styles.titleFooterControls}>{ allTranslations(localization.purchaseControlsPaymentAmount, { sum }) }</Text>

            <TouchableOpacity
                style={[
                    styles.buttonFooterControl,
                    (isProcessing) ? (!isCashPayment) ? styles.buttonFooterControlActive : styles.buttonFooterControlNotActive : {},
                    {marginBottom: 12}
                ]}
                activeOpacity={(isProcessing) ? 1 : 0.2}
                onPress={!isProcessing ? onMakeDeal : null}
            >
                <Text style={styles.buttonFooterControlText}>{ allTranslations(localization.purchaseControlsButtonOnline) }</Text>

                {
                    (isProcessing && !isCashPayment) && (
                        <View style={styles.buttonFooterControlIcon}>
                            <Icon style={{fontSize: 20, color: 'white'}} name="check-circle" type="Feather"/>
                        </View>
                    )
                }

            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.buttonFooterControl,
                    (isProcessing) ? (isCashPayment) ? styles.buttonFooterControlActive : styles.buttonFooterControlNotActive : {},
                    !cashAvailable && styles.buttonFooterControlDisabled
                ]}
                activeOpacity={(cashAvailable) ? 0.2 : (!isProcessing) ? 0.4 : 1}

                onPress={(!isProcessing && cashAvailable) ? onMakeDealCash : null}
            >
                <Text style={[styles.buttonFooterControlText, {
                    fontSize: 15,
                    lineHeight: 17
                }, !cashAvailable && styles.buttonFooterControlTextDisabled]}>{ allTranslations(localization.purchaseControlsButtonCash) }</Text>

                {
                    (isProcessing && isCashPayment) && (
                        <View style={styles.buttonFooterControlIcon}>
                            <Icon style={{fontSize: 20, color: 'white'}} name="check-circle" type="Feather"/>
                        </View>
                    )
                }

            </TouchableOpacity>

            {
                (!cashAvailable) && (
                    <Text style={styles.textInformationDisabledCash}>{allTranslations(localization.purchaseControlsErrorCash)}</Text>
                )
            }

            <View style={{justifyContent: "center", alignItems: "center", marginTop: 22}}>
                <TouchableOpacity onPress={handleSendReportIssue}>
                    <Text style={styles.buttonReportIssue}>{allTranslations(localization.purchaseSendErrorPurchase)}</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}
const ProductEvaluation = (props) => {
    const {review, purRating, purReview, onChangeRating, onSendRating, onChangeReview} = props;

    let isDisabledReview = !!purRating || !!purReview;

    let {rating} = props;

    if (isDisabledReview) {
        rating = purRating;
    }

    const handleOnChangeRating = (level) => {
        if (isDisabledReview) {
            return null
        }

        onChangeRating(level)
    }

    return (
        <View>

            <View style={styles.separate}/>

            <View style={styles.sectionRating}>

                <Text style={styles.sectionRatingTitle}>{ allTranslations(localization.purchaseEvaluationTitle) }</Text>

                <View style={styles.sectionRatingItems}>
                    <TouchableOpacity activeOpacity={isDisabledReview ? 1 : 0.2} onPress={() => handleOnChangeRating(1)} style={styles.sectionRatingItem}><RatingStarIcon color={rating >= 1 ? '#8152E4' : '#E8E8E8'}/></TouchableOpacity>
                    <TouchableOpacity activeOpacity={isDisabledReview ? 1 : 0.2} onPress={() => handleOnChangeRating(2)} style={styles.sectionRatingItem}><RatingStarIcon color={rating >= 2 ? '#8152E4' : '#E8E8E8'}/></TouchableOpacity>
                    <TouchableOpacity activeOpacity={isDisabledReview ? 1 : 0.2} onPress={() => handleOnChangeRating(3)} style={styles.sectionRatingItem}><RatingStarIcon color={rating >= 3 ? '#8152E4' : '#E8E8E8'}/></TouchableOpacity>
                    <TouchableOpacity activeOpacity={isDisabledReview ? 1 : 0.2} onPress={() => handleOnChangeRating(4)} style={styles.sectionRatingItem}><RatingStarIcon color={rating >= 4 ? '#8152E4' : '#E8E8E8'}/></TouchableOpacity>
                    <TouchableOpacity activeOpacity={isDisabledReview ? 1 : 0.2} onPress={() => handleOnChangeRating(5)} style={styles.sectionRatingItem}><RatingStarIcon color={rating >= 5 ? '#8152E4' : '#E8E8E8'}/></TouchableOpacity>
                </View>

            </View>

            <View style={styles.separate}/>

            <View style={styles.sectionReview}>
                <Text style={[styles.sectionRatingTitle, {marginBottom: 16}]}>{ allTranslations(localization.purchaseEvaluationYourFeedback) }</Text>

                <Input
                    value={!!isDisabledReview ? purReview : review}
                    multiline
                    disabled={!!isDisabledReview}
                    placeholder={!isDisabledReview ? allTranslations(localization.purchaseEvaluationYourFeedbackPlaceholder) : ""}

                    onChangeText={onChangeReview}
                />

            </View>

            {
                !isDisabledReview && (
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity style={styles.buttonBuy} onPress={onSendRating}>
                            <Text style={styles.buttonBuyText}>{ allTranslations(localization.commonSend) }</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    container: {
        paddingHorizontal: 16,
        paddingVertical: 24,

        borderRadius: 10,

        backgroundColor: 'white'
    },

    header: {
        position: 'relative',

        alignItems: 'center',

        marginBottom: 32
    },

    buttonClose: {
        position: 'absolute',
        top: -24,
        right: -16,

        padding: 24
    },

    logoContainer: {
        width: 75,
        height: 75,

        marginTop: 16,
        marginBottom: 16,

        padding: 12,

        borderWidth: 0.5,
        borderStyle: 'solid',
        borderColor: '#CBCCD4',
        borderRadius: 999,

        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontFamily: 'AtypText_medium',
        fontSize: 22,
        lineHeight: 24,

        marginBottom: 32
    },

    buttonBuy: {
        paddingVertical: 12,
        paddingHorizontal: 32,

        backgroundColor: '#8152E4',
        borderRadius: 10
    },
    buttonBuyText: {
        fontSize: 20,
        lineHeight: 22,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'AtypText_medium'
    },

    commentTitle: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: 1,

        marginBottom: 8
    },

    footerControls: {},

    titleFooterControls: {
        fontFamily: 'AtypDisplay',
        fontSize: 20,
        lineHeight: 22,
        letterSpacing: 0.1,
        textAlign: 'center',

        marginBottom: 16
    },

    buttonFooterControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: 24,
        paddingVertical: 12,

        backgroundColor: '#8152E4',

        borderRadius: 10
    },
    buttonFooterControlActive: {
        backgroundColor: '#61AE2C'
    },
    buttonFooterControlNotActive: {
        backgroundColor: '#CBCCD4'
    },
    buttonFooterControlDisabled: {
        backgroundColor: '#D1D1D1',
        opacity: 0.4
    },
    buttonFooterControlText: {
        fontSize: 20,
        lineHeight: 22,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'AtypText_medium'
    },
    buttonFooterControlTextDisabled: {
        color: '#808080'
    },
    buttonFooterControlIcon: {
        marginLeft: 10,

        width: 20,
        height: 20
    },

    textInformationDisabledCash: {
        marginTop: 16,

        textAlign: 'center',
        fontSize: 14,
        lineHeight: 15,
        color: '#D1D1D1'
    },

    billStatus: {
        flex: 1,
        marginBottom: 40,

        textAlign: 'center',
        fontFamily: 'AtypDisplay_medium',
        fontSize: 20,
        lineHeight: 22,
        letterSpacing: 1
    },
    billStatusConfirmed: {
        color: '#94D36C'
    },
    billStatusNotConfirmed: {
        color: '#FF9494'
    },
    billStatusProcessing: {
        color: '#ED8E00'
    },


    separate: {
        height: 1,
        marginLeft: -16,
        marginRight: -16,

        backgroundColor: '#E8E8E8'
    },

    sectionRating: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 12
    },
    sectionRatingTitle: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 16,
        letterSpacing: 1,
        color: '#808080',

        marginRight: 24
    },

    sectionRatingItems: {
        flexDirection: 'row',
        alignItems: 'center',

        marginLeft: -8
    },
    sectionRatingItem: {
        width: 35,
        height: 35,

        justifyContent: 'center',
        alignItems: 'center',

        padding: 5
    },

    sectionReview: {
        paddingVertical: 28,

        marginBottom: 4
    },

    textDateTime: {
        fontFamily: 'AtypText',
        fontSize: 13,
        lineHeight: 16,
        color: '#999DB1',
        letterSpacing: 1
    },
    textDateDash: {
        flexDirection: 'row',
    },
    textDateContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 6
    },


    sectionsCashier: {
        marginTop: -24,
        marginBottom: 48
    },
    sectionsCashierTitle: {
        fontSize: 10,
        lineHeight: 12,
        color: '#808080',
        fontFamily: 'AtypText',

        marginBottom: 4
    },
    sectionsCashierBody: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    sectionsCashierBodyLeft: {},
    sectionsCashierBodyRight: {
        marginLeft: 16,
        flex: 1
    },
    sectionsCashierBodyArrow: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionsCashierLogoContainer: {
        width: 80,
        height: 80,
        borderRadius: 999,

        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#8152E4'
    },
    sectionsCashierLogo: {},
    sectionsCashierButtonGo: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionsCashierUserName: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 20,
    },



    buttonOpenTips: {
        backgroundColor: '#8152E4',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',

        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,

        marginTop: 28,
        marginHorizontal: -16,
        marginBottom: -24
    },
    buttonOpenTipsText: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 24,
        color: 'white'
    },

    buttonWallet: {
        position: 'absolute',
        left: 8,
        bottom: 11,

        width: 110,
        height: 38,
    },

    buttonReportIssue: {
        fontFamily: "AtypText",
        fontSize: 14,
        lineHeight: 15,
        textAlign: "center",
        color: "#C4A2FC"
    }
})

export default PaymentPurchase
