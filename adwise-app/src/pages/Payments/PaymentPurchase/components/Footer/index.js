import React, {PureComponent} from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {
    Icon
} from "native-base";
import {formatMoney} from "../../../../../helper/format";
import currencies from "../../../../../constants/currency";
import {NumericalReliability} from "../../../../../helper/numericalReliability";

class Footer extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            bottomView: '',
        }
    }

    onChangeBottomView = (name) => {
        if (name === this.state.bottomView) {
            name = "";
        }

        this.setState({bottomView: name});
    }

    render() {
        const {
            sumInPoints, currency, productsCount, qrCode, order, cashAvailable, onPayPurchase, purchaseStatus,
            paymentType, isSendTips, isOrganizationTips, onSendTips, usedPoints, isDisabledOnline
        } = this.props;
        const { bottomView } = this.state;
        const isOpenChoicePayment = Boolean(bottomView === 'choice-payment');
        const isOpenQrCode = Boolean(bottomView === 'qr-code');
        const paymentTitle = Boolean(paymentType === 'cashless') ? 'Онлайн' : 'Наличные';
        const isNotPaid = Boolean(purchaseStatus === 'not-paid');
        const isShowSendTips = Boolean(purchaseStatus === 'completed' && !isSendTips && isOrganizationTips);

        if (Boolean(purchaseStatus === 'completed' && !isShowSendTips)) {
            return null
        }

        return (
            <View style={styles.root}>

                <View style={styles.header}>
                    {
                        !isShowSendTips ? (
                            <>
                                <View style={styles.info}>
                                    <Text style={styles.price}>{formatMoney(sumInPoints - usedPoints)} {currencies[currency]}</Text>
                                    <Text style={styles.count}>{productsCount} {NumericalReliability(productsCount, ['товар', 'товара', 'товаров'])}</Text>
                                </View>
                                <View style={styles.controls}>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            isOpenChoicePayment && styles.buttonSecondary,
                                            !isNotPaid && styles.buttonSuccess
                                        ]}
                                        activeOpacity={isNotPaid ? 0.2 : 1}
                                        onPress={() => isNotPaid ? this.onChangeBottomView('choice-payment') : null}
                                    >
                                        <Text style={[styles.buttonText, isOpenChoicePayment && styles.buttonTextSecondary]}>
                                            {purchaseStatus === 'not-paid' ? 'Выбрать способ оплаты' : paymentTitle}
                                        </Text>

                                        {
                                            !isNotPaid && (
                                                <Icon name="check-circle" type="Feather" style={{fontSize: 16, color: 'white', marginRight: 12, marginLeft: -4}}/>
                                            )
                                        }
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.button, isOpenQrCode && styles.buttonSecondary, styles.buttonQrCode]}
                                        onPress={() => this.onChangeBottomView('qr-code')}
                                    >
                                        <Icon name="qrcode" type="FontAwesome5" style={[styles.buttonQrCodeIcon, isOpenQrCode && {color: '#8152E4'}]}/>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity style={styles.buttonSendTips} onPress={onSendTips}>
                                    <Icon type="FontAwesome5" name="thumbs-up" style={styles.buttonSendTipsIcon}/>

                                    <Text style={styles.buttonSendTipsText}>Оставить чаевые</Text>
                                </TouchableOpacity>
                            </>
                        )
                    }
                </View>

                {
                    Boolean(bottomView) && (
                        <View style={styles.body}>

                            {
                                Boolean(bottomView === 'choice-payment') && (
                                    <>

                                        <TouchableOpacity
                                            style={[styles.button, {height: 44}, isDisabledOnline && styles.buttonDisabled]}
                                            activeOpacity={!isDisabledOnline ? 0.2 : 1}
                                            onPress={() => isDisabledOnline ? null : onPayPurchase('online')}
                                        >
                                            <Text style={[styles.buttonText]}>Онлайн</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.button, {marginTop: 12}, !cashAvailable && styles.buttonDisabled]}
                                            activeOpacity={cashAvailable ? 0.2 : 1}
                                            onPress={() => cashAvailable ? onPayPurchase('cash') : null}
                                        >
                                            <Text style={[styles.buttonText, !cashAvailable && styles.buttonTextDisabled]}>Наличными при получении</Text>
                                        </TouchableOpacity>

                                    </>
                                )
                            }

                            {
                                Boolean(bottomView === 'qr-code') && (
                                    <View style={{alignItems: 'center', marginTop: 24}}>

                                        <View style={styles.qrCode}>
                                            <Image
                                                style={{flex: 1}}
                                                source={{uri: qrCode}}
                                            />
                                        </View>

                                        <Text style={styles.qrCodeText}>{order}</Text>

                                    </View>
                                )
                            }

                        </View>
                    )
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: 'white',

        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,

        paddingHorizontal: 12,
        paddingVertical: 12,

        elevation: 2
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    body: {
        paddingTop: 12
    },

    info: {},
    price: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 20,
        color: 'black'
    },
    count: {
        fontFamily: 'AtypText',
        fontSize: 12,
        lineHeight: 13,
        color: '#808080',

        marginTop: 3
    },

    controls: {
        flexDirection: "row",
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 32,
        backgroundColor: '#8152E4',
        borderRadius: 6,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#8152E4'
    },
    buttonDisabled: {
        backgroundColor: 'rgba(209, 209, 209, 0.3)',
        borderColor: 'rgba(209, 209, 209, 0.3)',
    },
    buttonText: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 15,
        textAlign: 'center',
        color: 'white',
        paddingHorizontal: 12
    },
    buttonTextDisabled: {
        color: '#808080'
    },
    buttonPrimary: {
        backgroundColor: '#8152E4'
    },
    buttonSuccess: {
        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: '#61AE2C',
        borderColor: '#61AE2C',
    },
    buttonSecondary: {
        backgroundColor: 'transparent'
    },
    buttonTextSecondary: {
        color: '#8152E4'
    },

    buttonQrCode: {
        width: 34,
        marginLeft: 8
    },
    buttonQrCodeIcon: {
        color: 'white',
        fontSize: 20
    },

    qrCode: {
        width: 156,
        height: 156,
        marginBottom: 24
    },
    qrCodeText: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 22,
        color: '#25233E'
    },

    buttonSendTips: {
        height: 34,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#50348C',
        borderRadius: 6
    },
    buttonSendTipsIcon: {
        fontSize: 16,
        color: 'white'
    },
    buttonSendTipsText: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 14,
        textAlign: 'center',
        color: 'white',
        marginLeft: 10
    },
});

export default Footer
