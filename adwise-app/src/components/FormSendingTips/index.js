import React, {useState, useEffect, useRef} from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    RatingStar as RatingStarIcon,
    PersonalSmallCard as PersonalSmallCardIcon
} from "../../icons";
import {compose} from "recompose";
import {connect} from "react-redux";
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {formatMoney} from "../../helper/format";

const FormSendingTips = (props) => {
    const {isOpen, onClose, app, purchase, onSendTips} = props;
    const {cashier} = purchase;
    const {tipsMinimalAmount} = app?.global || {};

    const [amountTips, setAmountTips] = useState('');
    const [activeButton, setActiveButton] = useState(-1);

    const refModalize = useRef();

    useEffect(() => {
        if (isOpen) {
            refModalize.current?.open();
        }
        if (!isOpen) {
            refModalize.current?.close();
        }
    }, [isOpen]);

    const handleOnChangeAmount = (value) => {
        if (value !== '' && !Number.parseFloat(value)) {
            return null
        }

        value = value !== '' ? Number.parseFloat(value).toString() : "";

        setAmountTips(value);
        setActiveButton(-1);
    }
    const handleOnChangePercent = (percent, idx) => {
        let amount = purchase.sumInPoints / 100 * percent;
        handleOnChangeAmount(Math.floor(amount));
        setActiveButton(idx);
    }

    const handleOnSubmit = () => {
        if (amountTips < tipsMinimalAmount) {
            return null
        }

        const body = {
            cashierUserId: cashier.ref,
            sum: amountTips,
            purchaseId: purchase._id
        };

        onSendTips(body);
    }

    return (
        <Portal>

            <Modalize
                ref={refModalize}
                onClosed={onClose}
                adjustToContentHeight={true}
                scrollViewProps={{
                    alwaysBounceHorizontal: false,
                    alwaysBounceVertical: false,
                    bounces: false
                }}
            >

                <View style={styles.root}>

                    <Text style={styles.title}>Оставить чаевые</Text>

                    <View style={styles.sectionCashier}>

                        <View style={styles.cashierLogo}>
                            {
                                Boolean(cashier?.picture?.value) ? (
                                    <Image
                                        source={{uri: cashier?.picture?.value}}
                                        style={{flex: 1}}
                                    />
                                ) : (
                                    <PersonalSmallCardIcon width="100%" height="100%" color="#808080"/>
                                )
                            }
                        </View>

                        <View style={styles.cashierBody}>

                            <Text style={styles.cashierCaption}>Ваш обслуживал официант</Text>

                            <View style={styles.cashierMain}>

                                <View>
                                    <Text style={styles.cashierName}>{cashier?.firstName?.value}</Text>
                                    <Text style={styles.cashierName}>{cashier?.lastName?.value}</Text>
                                </View>

                                {
                                    false && (
                                        <View style={{marginLeft: 8, flexDirection: 'row', alignItems: 'center'}}>
                                            <View style={{width: 14, height: 14}}><RatingStarIcon width="100%" height="100%" color="#8152E4"/></View>
                                            <Text style={styles.cashierRating}>4,6</Text>
                                        </View>
                                    )
                                }

                            </View>

                            <Text style={styles.cashierMessage} numberOfLines={1}>{cashier?.description?.value}</Text>

                        </View>

                    </View>

                    <View style={styles.sectionForm}>

                        <Text style={styles.formTitle}>Сумма в чеке: {formatMoney(purchase?.sumInPoints)}₽</Text>

                        <TextInput
                            value={amountTips}
                            style={styles.formInput}
                            placeholder="10₽"
                            keyboardType="number-pad"
                            onChangeText={handleOnChangeAmount}
                        />

                        <Text style={styles.formHelper}>Минимальная сумма для оставления чаевых — {tipsMinimalAmount}₽</Text>

                        <View style={styles.formButtons}>
                            {
                                [7, 10, 15, 20].map((percent, idx) => {
                                    const isDisabled = Boolean(purchase.sumInPoints / 100 * percent < tipsMinimalAmount);
                                    const isActive = activeButton === idx;

                                    return (
                                        <TouchableOpacity
                                            style={[
                                                styles.formButton,
                                                isActive && styles.formButtonActive,
                                                isDisabled && styles.formButtonDisabled,
                                            ]}
                                            activeOpacity={percent}
                                            onPress={() => isDisabled ? null : handleOnChangePercent(percent, idx)}
                                        >
                                            <Text style={styles.formButtonText}>{percent}%</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.buttonPay,
                                Boolean(amountTips < tipsMinimalAmount) && styles.buttonPayDisabled
                            ]}
                            activeOpacity={Boolean(amountTips < tipsMinimalAmount) ? 1 : 0.2}
                            onPress={handleOnSubmit}
                        >
                            <Text style={styles.buttonPayText}>Оплатить</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </Modalize>

        </Portal>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: 12,

        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    title: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: '#25233E',
        textAlign: 'center',
        marginBottom: 20
    },

    // Секция кассира
    sectionCashier: {
        marginBottom: 25,

        flexDirection: 'row'
    },
    cashierLogo: {
        width: 80,
        height: 80,
        borderRadius: 999,
        marginRight: 16,
        overflow: 'hidden',
        backgroundColor: '#E8E8E8'
    },
    cashierBody: {},
    cashierCaption: {
        fontFamily: 'AtypText',
        fontSize: 10,
        lineHeight: 12,
        color: '#808080',
        marginBottom: 4
    },
    cashierMain: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 8
    },
    cashierName: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 20,
        color: '#000000'
    },
    cashierRating: {
        fontFamily: "AtypText_semibold",
        fontSize: 15,
        lineHeight: 18,
        color: '#8152E4',
        marginLeft: 3
    },
    cashierMessage: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 17,
        color: '#000000'
    },
    // -------------

    // Секция с формой
    sectionForm: {},
    formTitle: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 17,
        textAlign: 'center',
        color: '#808080',
        marginBottom: 10
    },
    formHelper: {
        fontFamily: 'AtypText',
        fontSize: 10,
        lineHeight: 12,
        color: '#808080',
        marginBottom: 12
    },
    formInput: {
        height: 45,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: 5,
        backgroundColor: 'white',
        marginBottom: 4,

        fontFamily: 'AtypText_medium',
        fontSize: 24,
        textAlign: 'center',
        color: 'black'
    },
    formButtons: {
        flexDirection: "row",
        marginLeft: -8,
        marginBottom: 24
    },
    formButton: {
        flex: 1,
        height: 35,
        borderRadius: 6,
        marginLeft: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DCD4EA'
    },
    formButtonActive: {
        backgroundColor: '#8152E4',
    },
    formButtonDisabled: {
        backgroundColor: '#E8E8E8',
    },
    formButtonText: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 16,
        color: 'white',
        textAlign: 'center'
    },
    // ---------------

    buttonPay: {
        width: '100%',
        height: 45,
        backgroundColor: '#8152E4',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonPayDisabled: {
        backgroundColor: '#E8E8E8',
    },
    buttonPayText: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 18,
        color: 'white'
    }
});

export default compose(
    connect(
        state => ({
            app: state.app
        })
    ),
)(FormSendingTips);
