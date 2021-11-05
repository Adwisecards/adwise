import React, {useRef, useState, useEffect} from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from "react-native";
import {
    Icon
} from "native-base";
import {
    RatingStar as RatingStarIcon,
    PersonalSmallCard
} from "../../icons";
import {formatMoney} from "../../helper/format";
import {Modalize} from 'react-native-modalize';
import {compose} from "recompose";
import {connect} from "react-redux";
import {Portal} from 'react-native-portalize';
import {updateAccount} from "../../AppState";
import ProfileEditView from "../../pages/ProfileEdit/ProfileEditView";
import localization from "../../localization/localization";
import allTranslations from "../../localization/allTranslations";

const {width, height} = Dimensions.get('window');

const FormSendingTips = (props) => {
    const {isOpen, onClose, purchase, onCreateEmployeeRating, onSendTips, app} = props;

    // if (!isOpen) {
    //     return null
    // }

    const [rating, setRating] = useState(0);
    const [sum, setSum] = useState('');
    const [negativeMessage, setNegativeMessage] = useState('');
    const [listInterestPlan, setListInterestPlan] = useState([]);

    const refModalize = useRef();
    const price = purchase?.coupon?.price;
    const tipsMinimalAmount = app?.global?.tipsMinimalAmount;

    useEffect(() => {
        if (!isOpen) {
            refModalize.current?.close();
        }
        if (isOpen) {
            refModalize.current?.open();
        }

        handleSetListInterestPlan();
    }, [isOpen]);

    const handleSetListInterestPlan = () => {
        let listInterestPlan = [];

        const onePercent = price / 100;

        listInterestPlan.push({
            value: Math.ceil(onePercent * 5),
            title: '7'
        });
        listInterestPlan.push({
            value: Math.ceil(onePercent * 10),
            title: '10'
        });
        listInterestPlan.push({
            value: Math.ceil(onePercent * 15),
            title: '15'
        });
        listInterestPlan.push({
            value: Math.ceil(onePercent * 20),
            title: '20'
        });

        setListInterestPlan(listInterestPlan);
    }
    const handleEntryPercent = (item) => {
        let value = Number(item.value) < tipsMinimalAmount ? tipsMinimalAmount : Number(item.value);

        setSum(String(value));
    }

    const handleOnChangeSum = (value) => {
        value = String(value);

        setSum(value);
    }
    const handleOnClose = () => {
        setRating(0);
        setNegativeMessage('');
        setSum('');
        setListInterestPlan([]);

        onClose();
    }

    const handleSend = () => {
        if (rating > 0) {
            handleCreateEmployeeRating();
        }
        if ((rating === 0 || rating >= 3) && sum >= tipsMinimalAmount) {
            handleSendTips();
        }
    }
    const handleCreateEmployeeRating = () => {
        const cashier = purchase.cashier._id;
        const purchaser = purchase.purchaser._id || purchase.purchaser;

        const body = {
            employeeContactId: cashier,
            purchaserContactId: purchaser,
            rating: rating,
            comment: negativeMessage
        };

        onCreateEmployeeRating(body)
    }
    const handleSendTips = () => {
        const cashier = purchase.cashier.ref;

        const body = {
            cashierUserId: cashier,
            sum: sum,
            purchaseId: purchase._id
        };


        onSendTips(body);
    }

    const imageCashier = purchase.cashier?.picture?.value || '';
    const sendDisabled = !rating && sum < tipsMinimalAmount;

    return (
        <Portal>
            <Modalize
                ref={refModalize}
                onClose={handleOnClose}
                adjustToContentHeight={true}
                scrollViewProps={{
                    alwaysBounceHorizontal: false,
                    alwaysBounceVertical: false,
                    bounces: false
                }}
            >
                <View style={styles.container}>

                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={[styles.cashierLogoContainer, !imageCashier && {padding: 0}]}>
                                {
                                    !!imageCashier ? (
                                        <Image
                                            style={styles.cashierLogo}
                                            source={{uri: imageCashier}}
                                        />
                                    ) : (
                                        <PersonalSmallCard style={{margin: -2}} width={80} height={80} color="#8152E4"/>
                                    )
                                }
                            </View>
                        </View>
                        <View style={styles.headerRight}>
                            <Text
                                style={styles.cashierPosition}>{allTranslations(localization.componentsFormSendingTipsServesYou)}</Text>

                            <View style={{marginBottom: 8}}>
                                <Text style={styles.cashierName}>{purchase.cashier?.firstName.value}</Text>
                                <Text style={styles.cashierName}>{purchase.cashier?.lastName.value}</Text>
                            </View>

                            <Text style={styles.cashierDescription}
                                  numberOfLines={1}>{purchase.cashier?.tipsMessage}</Text>
                        </View>
                    </View>

                    <View style={styles.body}>

                        <View style={{marginBottom: 24}}>

                            <Text
                                style={styles.ratingTitle}>{allTranslations(localization.componentsFormSendingTipsDidTouLikeEverything)}</Text>

                            <View style={styles.ratingLine}>
                                {
                                    [1, 2, 3, 4, 5].map((level) => {
                                        const isActive = rating >= level;

                                        return (
                                            <TouchableOpacity
                                                onPress={() => setRating(level)}
                                                style={styles.ratingItem}
                                            >
                                                <RatingStarIcon width={40} height={40}
                                                                color={isActive ? '#8152E4' : '#E8E8E8'}/>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>

                        </View>

                        {
                            (rating >= 3 || !rating) && (
                                <PositiveForm
                                    sum={sum}
                                    price={price}
                                    tipsMinimalAmount={tipsMinimalAmount}

                                    setSum={setSum}
                                    listInterestPlan={listInterestPlan}
                                    handleOnChangeSum={handleOnChangeSum}
                                    handleEntryPercent={handleEntryPercent}
                                />
                            )
                        }

                        {
                            (rating < 3 && rating !== 0) && (
                                <NegativeForm
                                    negativeMessage={negativeMessage}

                                    setNegativeMessage={setNegativeMessage}
                                />
                            )
                        }

                    </View>

                    <View style={styles.footer}>

                        <TouchableOpacity
                            style={[styles.buttonPay, !!sendDisabled && styles.buttonPayDisabled]}
                            onPress={sendDisabled ? null : handleSend}
                        >
                            <Text style={styles.buttonPayTitle}>
                                {allTranslations(localization.componentsFormSendingTipsDone)}
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </Modalize>
        </Portal>
    )
};

const PositiveForm = (props) => {
    return (
        <View>

            <Text
                style={styles.sumTitle}>{allTranslations(localization.componentsFormSendingTipsCheckAmount)}: {formatMoney(props.price, 0, '')}₽</Text>

            <View style={styles.sumInputContainer}>

                <TextInput
                    value={props.sum}
                    placeholder={allTranslations(localization.componentsFormSendingTipsEnterAmount)}
                    style={styles.sumInput}
                    keyboardType="numeric"

                    onChangeText={props.handleOnChangeSum}
                />

                <TouchableOpacity style={styles.sumInputButtonClear} onPress={() => props.setSum(0)}>
                    <Icon style={{fontSize: 20, color: '#CBCCD4'}} name="close" type="MaterialIcons"/>
                </TouchableOpacity>

            </View>
            <Text style={styles.sumInputHint}>{allTranslations(localization.componentsFormSendingTipsMinimumAmount)}
                <Text style={{fontFamily: 'AtypText_medium'}}>{props.tipsMinimalAmount}₽</Text></Text>

            <View style={styles.sumPercentContainer}>

                {
                    props.listInterestPlan.map((item, idx) => (
                        <TouchableOpacity
                            key={`button-percent-${idx}`}
                            onPress={() => props.handleEntryPercent(item)}
                            style={[styles.sumPercent, Boolean(item.value == props.sum) && styles.sumPercentActive]}
                        >
                            <Text style={styles.sumPercentTitle}>{item.title}%</Text>
                        </TouchableOpacity>
                    ))
                }

            </View>

        </View>
    )
}
const NegativeForm = (props) => {

    return (
        <View>
            <Text
                style={styles.sumTitle}>{allTranslations(localization.componentsFormSendingTipsPleaseDescribeSituation)}</Text>

            <TextInput
                style={styles.negativeMessage}

                multiline
            />

        </View>
    )
}

const styles = StyleSheet.create({
    root: {},

    container: {
        paddingTop: 24,
        paddingBottom: 24,
        paddingHorizontal: 24,

        backgroundColor: 'white',

        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,

        elevation: 15
    },

    header: {
        marginBottom: 32,

        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLeft: {},
    headerRight: {
        marginLeft: 16
    },

    body: {
        marginBottom: 24
    },

    footer: {},

    cashierLogoContainer: {
        width: 80,
        height: 80,

        padding: 2,

        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#8152E4',
        borderRadius: 999,
    },
    cashierLogo: {
        borderRadius: 999,

        flex: 1
    },

    cashierPosition: {
        fontFamily: 'AtypDisplay',
        fontSize: 10,
        lineHeight: 12,
        color: '#808080',

        marginBottom: 4
    },
    cashierName: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 20,
        color: 'black'
    },
    cashierDescription: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 17
    },

    ratingTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 17,
        textAlign: 'center',
        color: '#808080',

        marginBottom: 10
    },
    ratingLine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        marginLeft: -8
    },
    ratingItem: {
        marginLeft: 8
    },

    sumTitle: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 17,
        textAlign: 'center',
        color: '#808080',

        marginBottom: 10
    },
    sumInput: {
        flex: 1,
        paddingHorizontal: 40,

        fontFamily: 'AtypText_medium',
        fontSize: 24,
        textAlign: 'center',
        color: 'black'
    },
    sumInputContainer: {
        height: 45,

        marginBottom: 3,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: 5,

        position: 'relative'
    },
    sumInputHint: {
        fontFamily: 'AtypText',
        fontSize: 12,
        lineHeight: 12,
        color: 'black',
        opacity: 0.5,

        marginBottom: 12
    },
    sumInputButtonClear: {
        position: 'absolute',
        right: 7,
        top: 5,

        width: 34,
        height: 34,

        justifyContent: 'center',
        alignItems: 'center'
    },
    sumPercentContainer: {
        marginLeft: -12,

        flexDirection: 'row'
    },
    sumPercent: {
        height: 35,
        width: (width - 16) / 5,

        marginLeft: 12,

        backgroundColor: '#DCD4EA',

        borderRadius: 6,

        justifyContent: 'center',
        alignItems: 'center',
    },
    sumPercentActive: {
        backgroundColor: '#8152E4'
    },
    sumPercentTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 16,
        color: 'white'
    },

    buttonPay: {
        width: '100%',

        height: 44,

        backgroundColor: '#8152E4',

        borderRadius: 6,

        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonPayDisabled: {
        backgroundColor: '#CBCCD4',
        opacity: 0.5
    },
    buttonPayTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 18,
        color: 'white'
    },

    negativeMessage: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 19,
        color: 'black',

        paddingHorizontal: 12,
        paddingVertical: 8,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: 5,
        minHeight: 150
    },
});

FormSendingTips.defaultProps = {
    price: 2560
};

export default compose(
    connect(
        state => ({
            app: state.app
        })
    ),
)(FormSendingTips);
