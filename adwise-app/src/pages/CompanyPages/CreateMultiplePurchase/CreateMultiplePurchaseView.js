import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    ModalLoading,
    HeaderAccounts,
    DropDownHolder
} from "../../../components";
import {
    Page
} from "../components";
import {
    Stage1,
    Stage2,
    Stage3
} from "./components";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import {formatMoney} from "../../../helper/format";
import {amplitudeLogEventWithPropertiesAsync} from "../../../helper/Amplitude";
import getError from "../../../helper/getErrors";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class CreateMultiplePurchase extends Component {
    constructor(props) {
        super(props);

        const params = props.navigation.state.params;

        this.state = {
            stage: 1,
            totalSum: 0,
            totalCount: 0,

            coupons: [],
            couponsBuy: [],

            isLoading: true,
            isOpenModalLoading: false
        };

        this.organizationId = params.organizationId;
        this.organizationColor = params.organizationColor;
        this.defaultCashier = params.defaultCashier;
    }

    componentDidMount = () => {
        this.getCoupons();
    }

    getCoupons = () => {
        axios('get', `${ urls["get-coupons"] }${ this.organizationId }?limit=100`).then((response) => {
            this.setState({
                coupons: response.data.data.coupons,
                isLoading: false
            })
        })
    }

    onChangeStage = (stage) => {
        this.setState({ stage })
    }
    onNext = () => {
        let stage = this.state.stage;

        if (stage === 2){
            this.onCreatePurchase();

            return null
        }

        this.onChangeStage(stage + 1)
    }
    onPrev = () => {
        this.onChangeStage(this.state.stage - 1)
    }

    onCreatePurchase = () => {
        this.setState({ isOpenModalLoading: true });

        const { account, activeCutaway } = this.props.app;

        let contact = account.contacts[0];

        if (activeCutaway) {
            contact = account.contacts.find((t) => t._id === activeCutaway);
        }

        const body = {
            purchaserContactId: contact._id,
            cashierContactId: this.defaultCashier,
            coupons: this.state.couponsBuy.map((t) => {
                return {
                    couponId: t._id,
                    count: t?.count || 1
                }
            }),
            description: 'Покупка из приложения'
        };

        axios('post', urls["create-purchase"], body).then((response) => {
            (async () => {
                await amplitudeLogEventWithPropertiesAsync('purchase-user-create', {
                    ...body,
                    organizationId: this.organizationId
                })
            })();

            this.setState({isOpenModalLoading: false})

            this.onReset();

            this.props.navigation.push('PaymentPurchase', {
                purchaseId: response.data.data.purchaseId
            })

        }).catch((error) => {
            const errorBody = getError(error.response)
            this.setState({isOpenModalLoading: false})
            DropDownHolder.alert('error', errorBody?.title, errorBody?.message);
        })
    }
    onReset = () => {
        this.setState({
            stage: 1,
            totalSum: 0,
            couponsBuy: []
        })
    }

    onChangeCouponsBuy = (couponsBuy) => {
        let totalSum = couponsBuy.reduce((sum, coupon) => {
            return sum + (coupon.price * coupon.count || 1)
        }, 0)
        let totalCount = couponsBuy.reduce((sum, coupon) => {
            return sum + coupon.count
        }, 0)

        this.setState({
            couponsBuy,
            totalSum,
            totalCount
        });
    }

    render() {
        const { stage, coupons, couponsBuy, totalSum, totalCount, isLoading, isOpenModalLoading } = this.state;

        const isDisabledPrev = stage === 1;
        const isDisabledNext = couponsBuy.length <= 0;

        return (
            <Page style={styles.page} color={this.organizationColor}>
                <HeaderAccounts title={allTranslations(localization.companyPagesOrder)} {...this.props} styleRoot={{ marginBottom: 12 }}/>

                <View style={{ flex: 1 }}>
                    {
                        stage === 1 && (
                            <Stage1
                                coupons={coupons}
                                couponsBuy={couponsBuy}
                                color={this.organizationColor}
                                isLoading={isLoading}

                                onChangeCouponsBuy={this.onChangeCouponsBuy}
                            />
                        )
                    }
                    {
                        stage === 2 && (
                            <Stage2
                                coupons={couponsBuy}
                                color={this.organizationColor}
                                onChangeCouponsBuy={this.onChangeCouponsBuy}
                            />
                        )
                    }
                </View>

                {
                    stage === 2 && (
                        <View style={styles.totalInformation}>
                            <Text style={styles.totalInformationText}>
                                {allTranslations(localization.companyPagesTotalCountCreateOrder, {
                                    totalCount,
                                    totalSum: formatMoney(totalSum)
                                })}
                            </Text>
                        </View>
                    )
                }
                <View style={styles.footer}>
                    {
                        stage > 1 && (
                            <TouchableOpacity
                                onPress={isDisabledPrev ? null : this.onPrev}
                                style={[styles.prevButton, Boolean(isDisabledPrev) && { opacity: 0.4 }]}
                            >
                                <Text style={styles.prefButtonText}>{allTranslations(localization.commonGoBack)}</Text>
                            </TouchableOpacity>
                        )
                    }

                    <View style={[{opacity: 1, marginLeft: 12, flex: 1}, isDisabledNext && {opacity: 0.4}]}>
                        <TouchableOpacity
                            onPress={isDisabledNext ? null : this.onNext}
                            style={styles.nextButton}
                        >
                            <Text  style={styles.nextButtonText}>{stage === 2 ? allTranslations(localization.companyPagesCreate) : allTranslations(localization.companyPagesNext)}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ModalLoading
                    isOpen={isOpenModalLoading}
                />

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    totalInformation: {
        marginTop: 4,
        marginBottom: 4,
        paddingHorizontal: 12
    },
    totalInformationText: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        textAlign: 'right'
    },
    footer: {
        flexDirection: 'row',

        paddingVertical: 6,
        paddingHorizontal: 6,
        marginLeft: -12
    },
    nextButton: {
        height: 40,
        borderRadius: 10,
        paddingVertical: 10,
        backgroundColor: '#8152E4'
    },
    prevButton: {
        marginLeft: 12,
        flex: 1,
        height: 40,
        borderRadius: 10,
        paddingVertical: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#8152E4'
    },
    nextButtonText: {
        fontSize: 20,
        lineHeight: 22,
        color: 'white',
        fontFamily: 'AtypText_medium',
        textAlign: 'center'
    },
    prefButtonText: {
        fontSize: 20,
        lineHeight: 22,
        color: '#8152E4',
        fontFamily: 'AtypText_medium',
        textAlign: 'center'
    }
})

export default CreateMultiplePurchase
