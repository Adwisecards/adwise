import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {Icon} from "native-base";
import {DropDownHolder, ModalLoading, Page} from "../../../components";
import getHeightStatusBar from "../../../helper/getHeightStatusBar";
import commonStyles from "../../../theme/variables/commonStyles";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import getError from "../../../helper/getErrors";
import {
    PaymentPurchase as PaymentPurchaseIcon
} from '../../../icons';
import {
    Confirmed,
    TableProducts,
    PurchaseBonuses,
    ModalConfirmation,
    PurchaseInformation
} from './components';
import Dash from "react-native-dash";
import {formatCode, formatMoney} from "../../../helper/format";
import moment from "moment";
import {amplitudeLogEventWithPropertiesAsync} from "../../../helper/Logging";

const heightStatusBar = getHeightStatusBar();

class HistoryPurchase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            purchase: null,

            modalConfirm: {
                isOpen: false,
                headerCaption: '',
                message: '',

                onAccept: null,
                onClose: this.onCloseModalConfirm.bind(this)
            },

            countBonuses: 0,

            isError: false,
            isLoading: true,
            isSubmit: false,
            isSuccess: false,
            isUpdateUser: false
        };

        this.idDeal = null;
    }

    componentDidMount = () => {
        this.idDeal = this.props.navigation.state.params.purchaseId;

        this.onLoadDeal();

        this.props.navigation.addListener('didFocus', () => {
            this.idDeal = this.props.navigation.state.params.purchaseId;

            this.onLoadDeal();
        });
    }

    onLoadDeal = () => {
        axios('get', `${urls["get-purchase"]}${this.idDeal}`).then((response) => {
            this.setState({
                purchase: response.data.data.purchase,

                isLoading: false,
                isSubmit: false,
            })
        }).catch((error) => {
            const errorBody = getError(error.response);
            DropDownHolder.dropDown.alertWithType('error', errorBody.title, errorBody.message);

            this.setState({
                isError: true,
                isLoading: false
            })
        })
    }
    onIssueUser = () => {
        const cashierContact = this.props.app.account.contacts.find((t) => t.type === 'work');

        this.setState({ isSubmit: true });

        this.onCloseModalConfirm();

        axios('put', `${ urls['complete-purchase'] }${ this.idDeal }`, {
            cashierContactId: cashierContact._id
        }).then(async (response) => {
            await amplitudeLogEventWithPropertiesAsync("completion-order", {
                cashierContactId: cashierContact._id,
                purchaseId: this.idDeal
            })
            DropDownHolder.dropDown.alertWithType('success', 'Успешно', 'Заказ выдан покупателю');

            this.onLoadDeal();
        }).catch((error) => {
            const errorBody = getError(error.response)
            this.setState({ isSubmit: false })
            DropDownHolder.dropDown.alertWithType('error', errorBody.title, errorBody.message);
        });
    }

    onChangeCountBonuses = (countBonuses) => {
        this.setState({countBonuses})
    }

    onConfirmCashPayment = () => {
        this.setState({
            modalConfirm: {
                isOpen: false,
                headerCaption: '',
                message: '',

                onAccept: null,
                onClose: this.onCloseModalConfirm.bind(this)
            }
        });

        this.setState({ isSubmit: true });

        this.onCloseModalConfirm();

        axios('post', `${ urls["confirm-cash-payment"] }${ this.state.purchase.payment }`, {}).then(async (response) => {
            await amplitudeLogEventWithPropertiesAsync("confirmation-cash-payment", {
                purchaseId: this.state.purchase.payment
            })

            DropDownHolder.dropDown.alertWithType('success', 'Успешно', 'Оплата заказа успешно подтверждена');

            this.onLoadDeal();
        }).catch((error) => {
            const errorBody = getError(error.response)
            this.setState({ isSubmit: false })
            DropDownHolder.dropDown.alertWithType('error', errorBody.title, errorBody.message);
        });
    }


    onOpenModalConfirmPayment = () => {
        const { purchase } = this.state;

        this.setState({
            modalConfirm: {
                isOpen: true,
                headerCaption: `Покупка ${ formatCode(purchase.ref.code) }`,
                message: 'Заказ оплачен наличными?',

                onAccept: this.onConfirmCashPayment.bind(this),
                onClose: this.onCloseModalConfirm.bind(this)
            }
        })
    }
    onOpenModalCompleteOrder = () => {
        const { purchase } = this.state;

        this.setState({
            modalConfirm: {
                isOpen: true,
                headerCaption: `Покупка ${ formatCode(purchase.ref.code) }`,
                message: 'Вы уверены, что хотите завершить заказ?',

                onAccept: this.onIssueUser.bind(this),
                onClose: this.onCloseModalConfirm.bind(this)
            }
        })
    }
    onCloseModalConfirm = () => {
        this.setState({
            modalConfirm: {
                isOpen: false,
                headerCaption: '',
                message: '',

                onAccept: null,
                onClose: this.onCloseModalConfirm.bind(this)
            }
        })
    }

    _routeGoBack = () => {
        this.props.navigation.goBack();
    }

    render() {
        if (this.state.isError) {
            return (
                <Page style={[styles.page, {marginTop: heightStatusBar}, commonStyles.container]}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Заказ не найден</Text>
                    </View>
                </Page>
            )
        }
        if (this.state.isLoading) {
            return (
                <Page style={[styles.page, {marginTop: heightStatusBar}, commonStyles.container]}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Идет загрузка заказа...</Text>
                    </View>
                </Page>
            )
        }
        if (this.state.isSuccess) {
            return (
                <Page style={[styles.page, {marginTop: heightStatusBar}, commonStyles.container]}>
                    <View style={styles.container}>
                        <Text style={[styles.title, {marginBottom: 24}]}>Оплачено</Text>

                        <TouchableOpacity style={styles.buttonBuy} onPress={this._routeGoBack}>
                            <Text style={styles.buttonBuyText}>На главную</Text>
                        </TouchableOpacity>
                    </View>
                </Page>
            )
        }

        const totalPrice = this.state.purchase.sumInPoints;
        const totalPaymentPrice = this.state.purchase.sumInPoints - this.state.purchase.usedPoints;
        const isConfirmed = this.state.purchase.confirmed;
        const isComplete = this.state.purchase.complete;
        const isCash = this.state.purchase.type === 'cash';
        const isUsedPoints = Boolean(this.state.purchase.usedPoints && this.state.purchase.usedPoints > 0);

        return (
            <Page style={[styles.page, {paddingTop: heightStatusBar}]}>
                <ScrollView
                    style={{flex: 1}}

                    contentContainerStyle={[commonStyles.container]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>

                        <View style={styles.header}>
                            <TouchableOpacity style={styles.buttonClose} onPress={this._routeGoBack}>
                                <Icon name="x" type="Feather" style={{fontSize: 25, color: '#CBCCD4'}}/>
                            </TouchableOpacity>

                            <View style={styles.logoContainer}>
                                <PaymentPurchaseIcon style={{marginLeft: 8, marginTop: 4}}/>
                            </View>

                            <Text style={styles.title}>Данные покупки</Text>

                            <Text style={[
                                styles.billStatus,

                                (this.state.purchase.confirmed && !this.state.purchase.complete) && styles.billStatusConfirmed,

                                (!this.state.purchase.confirmed && !this.state.purchase.processing) && styles.billStatusNotConfirmed,

                                (this.state.purchase.processing && !this.state.purchase.confirmed) && styles.billStatusProcessing,

                                (this.state.purchase.confirmed && this.state.purchase.complete) && styles.billStatusConfirmed,
                            ]}>
                                {
                                    (this.state.purchase.confirmed && !this.state.purchase.complete) && 'Оплачен'
                                }

                                {
                                    (!this.state.purchase.confirmed && !this.state.purchase.processing) && 'Неоплачен'
                                }

                                {
                                    (this.state.purchase.processing && !this.state.purchase.confirmed) && 'В процессе'
                                }

                                {
                                    (this.state.purchase.confirmed && this.state.purchase.complete) && 'Завершен'
                                }
                            </Text>

                            <View style={{ width: '100%' }}>
                                {(!!this.state.purchase && !!this.state.purchase.purchaser) && (
                                    <View style={styles.textDateContainer}>
                                        <Text style={styles.textDateTime}>Создан</Text>
                                        <View style={{ flex: 1, marginBottom: 4, marginLeft: 4, marginRight: 4 }}>
                                            <Dash
                                                dashGap={1}
                                                dashLength={1}
                                                dashThickness={1}
                                                style={styles.textDateDash}
                                                dashStyle={{borderRadius: 100}}
                                                dashColor={'#999DB1'}
                                            />
                                        </View>
                                        <Text style={styles.textDateTime}>{ moment(this.state.purchase.timestamp).format('DD.MM.YYYY / HH:mm') }</Text>
                                    </View>
                                )}
                                {(!!this.state.purchase && !!this.state.purchase.paidAt) && (
                                    <View style={styles.textDateContainer}>
                                        <Text style={styles.textDateTime}>Оплачен</Text>
                                        <View style={{ flex: 1, marginBottom: 4, marginLeft: 4, marginRight: 4 }}>
                                            <Dash
                                                dashGap={1}
                                                dashLength={1}
                                                dashThickness={1}
                                                style={styles.textDateDash}
                                                dashStyle={{borderRadius: 100}}
                                                dashColor={'#999DB1'}
                                            />
                                        </View>
                                        <Text style={styles.textDateTime}>{ moment(this.state.purchase.paidAt).format('DD.MM.YYYY / HH:mm') }</Text>
                                    </View>
                                )}
                                {(!!this.state.purchase && !!this.state.purchase.completedAt) && (
                                    <View style={styles.textDateContainer}>
                                        <Text style={styles.textDateTime}>Завершён</Text>
                                        <View style={{ flex: 1, marginBottom: 4, marginLeft: 4, marginRight: 4 }}>
                                            <Dash
                                                dashGap={1}
                                                dashLength={1}
                                                dashThickness={1}
                                                style={styles.textDateDash}
                                                dashStyle={{borderRadius: 100}}
                                                dashColor={'#999DB1'}
                                            />
                                        </View>
                                        <Text style={styles.textDateTime}>{ moment(this.state.purchase.completedAt).format('DD.MM.YYYY / HH:mm') }</Text>
                                    </View>
                                )}
                            </View>

                        </View>

                        <TableProducts
                            purchase={this.state.purchase}
                        />

                        <PurchaseInformation
                            purchase={this.state.purchase}
                            isComplete={isComplete}
                            isUsedPoints={isUsedPoints}
                        />

                        <View style={styles.viewInformation}>
                            <Text style={styles.viewInformationTitle}>Комментарий к заказу</Text>

                            <Text style={styles.viewInformationDiscription}>
                                {this.state.purchase.comment}
                            </Text>
                        </View>

                        {
                            (isComplete) && (
                                <View style={styles.viewInformation}>
                                    <Text style={styles.viewInformationTitle}>Отзыв к заказу</Text>

                                    <Text style={styles.viewInformationDiscription}>
                                        {this.state.purchase.review}
                                    </Text>
                                </View>
                            )
                        }

                        {
                            (isCash && !isComplete) && (
                                <View style={styles.sectionCashMoney}>

                                    <View>

                                        <TouchableOpacity
                                            style={[styles.buttonIssueUser, isConfirmed && styles.buttonGreen]}
                                            onPress={(!isConfirmed) ? this.onOpenModalConfirmPayment : null}
                                            activeOpacity={!isConfirmed ? 0.2 : 1}
                                        >
                                            <Text style={[styles.buttonIssueUserText, isConfirmed && styles.buttonGreenText]}>
                                                { isConfirmed ? 'Оплачено' : 'Оплачено наличными' }
                                            </Text>
                                        </TouchableOpacity>

                                    </View>


                                </View>
                            )
                        }

                        {
                            (!isComplete && !isConfirmed) && (
                                <View style={styles.footerControls}>
                                    <TouchableOpacity
                                        style={[styles.buttonIssueUser, styles.buttonIssueDisableUser]}
                                        activeOpacity={0.3}
                                    >
                                        <Text style={styles.buttonIssueUserText}>Завершить заказ</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }

                        {
                            (!isComplete && isConfirmed) && (
                                <View style={styles.footerControls}>
                                    <TouchableOpacity
                                        style={styles.buttonIssueUser}
                                        onPress={this.onOpenModalCompleteOrder}
                                    >
                                        <Text style={styles.buttonIssueUserText}>Завершить заказ</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }

                    </View>
                </ScrollView>

                <ModalLoading
                    isOpen={this.state.isSubmit}
                />

                <ModalConfirmation {...this.state.modalConfirm}/>
            </Page>
        );
    }
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

    viewInformation: {
        borderTopWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E8E8E8',

        paddingVertical: 10
    },
    viewInformationTitle: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 23,
        letterSpacing: 1,
        color: '#808080',

        marginBottom: 12
    },
    viewInformationDiscription: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 19
    },

    buttonIssueUser: {
        paddingHorizontal: 24,
        paddingVertical: 12,

        backgroundColor: '#8152E4',

        borderRadius: 6
    },
    buttonIssueDisableUser: {
        opacity: 0.3
    },
    buttonIssueUserText: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 20,
        color: 'white',
        textAlign: 'center'
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

    footerControls: {
        borderTopWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E8E8E8',

        marginHorizontal: -16,

        justifyContent: 'center',
        alignItems: 'center',

        paddingVertical: 32,
        paddingBottom: 8
    },

    sectionCashMoney: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        paddingVertical: 32
    },

    buttonGreen: {
        backgroundColor: '#93D36C'
    },
    buttonGreenText: {
        color: 'white'
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

    textTotalPayments: {
        fontFamily: "AtypText_medium",
        fontSize: 18,
        lineHeight: 20,
        textAlign: "center",
        marginBottom: 8
    },

    totalArrow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        paddingVertical: 10
    },
    totalTitle: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 23,
        letterSpacing: 1,
        color: '#808080'
    },
    totalValue: {
        flex: 1,
        textAlign: 'right',

        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 23,
        letterSpacing: 1
    },
    totalSeparate: {
        width: '100%',
        height: 1,

        backgroundColor: '#E8E8E8'
    },
})

export default HistoryPurchase
