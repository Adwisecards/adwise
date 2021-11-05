import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,

    SafeAreaView,
    FlatList,

    TouchableOpacity,
} from 'react-native';
import {
    Page,
    CouponCard,
    HeaderPurchase, DropDownHolder
} from "../../../components";
import {
    TotalInformation
} from './components';
import commonStyles from "../../../theme/variables/commonStyles";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";


class PurchaseCreateCoupon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buyItems: [],
            coupons: [],

            isLoadingCoupons: true
        }
    }

    componentDidMount = () => {
        this.onLoadCoupons();
    }

    onLoadCoupons = () => {
        const contact = this.props.app.account.contacts.find(((contact) => contact.type === 'work'));

        if (!contact) {
            DropDownHolder.dropDown.alertWithType('error', 'Ошибка', 'Вы не являетесь кассиром организации');

            this.props.navigation.goBack();

            return null
        }

        const organizationId = contact.organization._id || contact.organization;

        axios('get', `${ urls["get-coupons"] }${ organizationId }`).then((response) => {
           const coupons = response.data.data.coupons;

           this.setState({
               coupons,

               isLoadingCoupons: false
           })

        }).catch((error) => {
        });
    }

    onChangeBuyItems = (buyItems) => {
        this.setState({
            buyItems
        })
    }

    onConfirmation = () => {
        this.props.navigation.navigate('PurchaseConfirmationCoupon', {
            buyItems: this.state.buyItems,
            coupons: this.state.coupons
        })
    }

    render() {
        if (this.state.isLoadingCoupons){
            return (
                <Page style={styles.page}>

                    <HeaderPurchase title="Выбор акции" {...this.props}/>

                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={[commonStyles.container, { flex: 1 }]}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <Text>Идет загрузка...</Text>
                    </ScrollView>

                </Page>
            )
        }

        return (
            <Page style={styles.page}>

                <HeaderPurchase title="Выбор акции" {...this.props}/>

                <TotalInformation
                    buyItems={this.state.buyItems}
                    coupons={this.state.coupons}

                    onConfirmation={this.onConfirmation}
                />

                <SafeAreaView
                    style={[ commonStyles.container, { flex: 1 } ]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <FlatList
                        data={this.state.coupons}

                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}

                        renderItem={({ item }) => (<CouponCard item={item} buyItems={this.state.buyItems} onChangeBuyItems={this.onChangeBuyItems}/>)}
                    />
                </SafeAreaView>

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})

export default PurchaseCreateCoupon
