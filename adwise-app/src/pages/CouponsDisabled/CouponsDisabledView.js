import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity, FlatList, SafeAreaView,
} from 'react-native';
import {
    Page,
    HeaderAccounts, Coupon, CouponLoading, RefreshControl
} from "../../components";
import commonStyles from "../../theme/variables/commonStyles";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";


class CouponsDisabled extends Component {
    constructor(props) {
        super(props);

        this.state = {
            coupons: [],

            isLoading: true
        }
    }

    componentDidMount = () => {
        this.props.navigation.addListener('didFocus', async () => {
            this.getListDisabledCoupons();
        });
    }

    getListDisabledCoupons = () => {
        this.setState({ isLoading: true });

        axios('get', urls["get-user-hidden-coupons"]).then((response) => {
            const coupons = response.data.data.coupons;

            this.setState({
                coupons,
                isLoading: false
            })
        });
    }

    returnCouponActive = (couponId) => {
        axios('put', urls["remove-coupon-from-user-hidden-list"], {
            couponId
        }).then((response) => {
            let coupons = [...this.state.coupons];
            const couponIndex = coupons.findIndex((t) => t._id === couponId);

            coupons.splice(couponIndex, 1);

            this.setState({ coupons });
        });
    }

    render() {
        return (
            <Page style={styles.page}>

                <HeaderAccounts
                    title={allTranslations(localization.couponsDisabledTitle)}
                    styleRoot={{ marginBottom: 16 }}
                    {...this.props}
                />

                <SafeAreaView style={{flex: 1}}>
                    <FlatList
                        data={this.state.coupons}

                        contentContainerStyle={[commonStyles.container]}

                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}

                        ListHeaderComponent={() => {
                            if (!this.state.isLoading) {
                                return null
                            }

                            return (
                                <CouponLoading/>
                            )
                        }}
                        renderItem={(item) => {
                            if (this.state.isLoading) {
                                return null
                            }

                            return (
                                <Coupon
                                    {...item.item}
                                    {...this.props}

                                    titleButtonHide={allTranslations(localization.commonReturn)}

                                    isNotOpen
                                    isHideAnchor
                                    isHideSwipe={item.item.disabled}

                                    onHideCoupon={this.returnCouponActive}
                                />
                            )
                        }}

                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isLoading}
                                onRefresh={this.getListDisabledCoupons}
                            />
                        }
                    />
                </SafeAreaView>

            </Page>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '',
        };
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})

export default CouponsDisabled
