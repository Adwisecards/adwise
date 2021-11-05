import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
} from 'react-native';
import {
    Page,
    HeaderPurchase,
    CouponCard
} from "../../../components";
import commonStyles from "../../../theme/variables/commonStyles";
import {
    TotalInformation
} from "./components";


class PurchaseConfirmationCoupon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buyItems: [],
            coupons: [],
        }
    }

    componentDidMount = () => {
        let {buyItems, coupons} = this.props.navigation.state.params;

        let newCoupons = [];

        coupons.map((item) => {
            const isBuy = buyItems.find((itemList) => itemList._id === item._id);
            if (isBuy) {
                newCoupons.push(item)
            }
        });

        this.setState({
            buyItems,
            coupons: newCoupons
        })
    }

    onChangeBuyItems = (buyItems) => {
        this.setState({
            buyItems
        })
    }

    onToPurchaseInvoicing = () => {
        const buyItems = this.state.buyItems;
        let coupons = [];

        this.state.coupons.map((item) => {
            const isActive = buyItems.find((itemList) => itemList._id === item._id);

            if ( isActive ) {
                coupons.push({
                    ...item,
                    count: isActive.count
                })
            }
        });

        this.props.navigation.navigate('PurchaseInvoicingCoupon', {
            coupons
        });
    }

    render() {
        return (
            <Page style={styles.page}>
                <HeaderPurchase
                    title="Подтверждение счёта"
                    {...this.props}
                />

                <TotalInformation
                    buyItems={this.state.buyItems}
                    coupons={this.state.coupons}

                    onConfirmation={this.onConfirmation}
                />

                <SafeAreaView
                    style={[commonStyles.container, {flex: 1}]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <FlatList
                        data={this.state.coupons}

                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}

                        renderItem={({item}) => (
                            <CouponCard
                                item={item}
                                buyItems={this.state.buyItems}
                                onChangeBuyItems={this.onChangeBuyItems}
                            />
                        )}
                    />
                </SafeAreaView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={this.onToPurchaseInvoicing}>
                        <Text style={styles.buttonText}>Подтвердить</Text>
                    </TouchableOpacity>
                </View>

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    footer: {
        justifyContent: 'center',
        alignItems: 'center',

        paddingVertical: 40,
        paddingHorizontal: 30
    },

    button: {
        width: '100%',

        backgroundColor: '#8152E4',

        borderRadius: 10,

        paddingVertical: 12,
        paddingHorizontal: 24
    },
    buttonText: {
        fontFamily: 'AtypDisplay_medium',
        fontSize: 20,
        lineHeight: 24,
        color: 'white',
        textAlign: 'center'
    },
})

export default PurchaseConfirmationCoupon
