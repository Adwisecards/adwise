import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,

    TouchableOpacity,
    FlatList,
} from 'react-native';
import {
    Page,
    HeaderPurchase, DropDownHolder
} from "../../../components";
import {
    Tabs,
    QrCode,
    Products,
    CodeUser
} from './components';
import moment from "moment";
import commonStyles from "../../../theme/variables/commonStyles";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import getError from "../../../helper/getErrors";
import {amplitudeLogEventWithPropertiesAsync} from "../../../helper/Logging";


class PurchaseInvoicingCoupon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: [1, 0],

            purchase: {},

            cashback: 0,

            qrCode: '',
            errorMessage: '',

            isCreatePurchase: true,
            isErrorCreatePurchase: false
        }

        this.coupons = this.props.navigation.state.params.coupons;
    }

    componentDidMount = () => {
        this.createPurchase();
    }

    createPurchase = () => {
        const account = this.props.app.account;
        const coupons = this.coupons;
        const workCard = account.contacts.find((item) => item.type === 'work');

        const purchase = {
            cashierContactId: workCard._id,
            coupons: coupons.map((coupon) => {
                return {
                    couponId: coupon._id,
                    count: coupon.count
                }
            }),
            description: 'Покупка из приложения кассир'
        };

        axios('post', urls["create-purchase"], purchase).then(async (response) => {
            await amplitudeLogEventWithPropertiesAsync("create-purchase-from-app", purchase)

            this.getPurchasse(response.data.data.purchaseId)
        }).catch((error) => {
            const errorBody = getError(error.response)
            this.setState({ isLoadingSubmit: false })
            DropDownHolder.dropDown.alertWithType('error', errorBody.title, errorBody.message);

            this.setState({
                isCreatePurchase: false,
                isErrorCreatePurchase: true,
                errorMessage: errorBody
            })
        })
    }
    getPurchasse = (id) => {
        axios('get', `${ urls["get-purchase"] }${ id }`).then((response) => {
            this.setState({
                purchase: response.data.data.purchase,

                isCreatePurchase: false
            })
        }).catch((error) => {
            console.log('error: ', error.response)
        })
    }

    render() {
        const date = new Date();

        if ( this.state.isCreatePurchase ) {
            return (
                <Page style={styles.page}>

                    <HeaderPurchase
                        title="Выставление счёта"
                        { ...this.props }
                    />

                    {/*<Tabs*/}
                    {/*    page={this.state.page}*/}
                    {/*/>*/}

                    <View style={commonStyles.container}>
                        <Text>Идет загрузка...</Text>
                    </View>

                </Page>
            )
        }
        if ( this.state.isErrorCreatePurchase ) {
            return (
                <Page style={styles.page}>

                    <HeaderPurchase
                        title="Выставление счёта"
                        { ...this.props }
                    />

                    {/*<Tabs*/}
                    {/*    page={this.state.page}*/}
                    {/*/>*/}

                    <View style={commonStyles.container}>
                        <Text>{ this.state.errorMessage.title }</Text>
                        <Text>{ this.state.errorMessage.message }</Text>
                    </View>

                </Page>
            )
        }

        const countCashback = ( this.state.purchase.sumInPoints * (this.state.purchase.offer.percent / 100 ))

        return (
            <Page style={styles.page}>

                <HeaderPurchase
                    title="Выставление счёта"
                    { ...this.props }
                />

                <View style={[commonStyles.container, { flex: 1 }]}>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={{
                            paddingVertical: 24,
                            paddingHorizontal: 16,
                        }}

                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >

                        <Text style={styles.h1}>Создание заказа</Text>

                        <View style={styles.miniInformation}>

                            <Text style={styles.date}>{ moment(date).format('DD.MM.YYYY / HH:mm') }</Text>

                            <Text style={[styles.statusOrder, { color: '#FF9494' }]}>НЕОПЛАЧЕН</Text>

                        </View>

                        <Products
                            coupons={this.coupons}
                        />

                        <View style={styles.lineRow}>
                            <Text style={styles.titleCashback}>Кэшбэк</Text>
                            <Text style={styles.valueCashback}>{ countCashback } баллов</Text>
                        </View>

                        {
                            (!!this.state.page[0]) && ( <QrCode qrCode={this.state.purchase.ref.QRCode}/> )
                        }
                        {
                            (!!this.state.page[1]) && ( <CodeUser/> )
                        }


                    </ScrollView>
                </View>

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    scrollView: {
        flex: 1,

        backgroundColor: 'white',

        borderRadius: 10
    },

    h1: {
        fontFamily: 'AtypText',
        fontSize: 22,
        lineHeight: 24,

        marginBottom: 12
    },

    miniInformation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 24
    },

    date: {
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: 0.5,
        color: '#9FA3B7'
    },

    statusOrder: {
        fontSize: 11,
        lineHeight: 13,
        letterSpacing: 0.2
    },

    lineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 24
    },

    titleCashback: {
        fontSize: 12,
        lineHeight: 14,
        color: '#808080',
        fontFamily: 'AtypText'
    },

    valueCashback: {
        fontSize: 12,
        lineHeight: 14,
        color: '#000000',
        fontFamily: 'AtypText'
    },
})

export default PurchaseInvoicingCoupon
