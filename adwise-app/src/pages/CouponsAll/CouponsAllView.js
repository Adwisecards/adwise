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
    Coupon,
    HeaderAccounts,
    RefreshControl
} from "../../components";
import commonStyles from "../../theme/variables/commonStyles";
import {Icon} from "native-base";
import {getItemAsync, setItemAsync} from "../../helper/SecureStore";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";


class CouponsAll extends Component {
    constructor(props) {
        super(props);

        this.state = {
            favoriteCouponsIds: [],

            section: this.props.navigation.state.params.section
        };
    }

    componentDidMount = async () => {
        await this.onUpdateFavoriteCouponsIds();
    }

    onAddCouponFavorite = (coupon) => {
        axios('put', `${urls["coupons-add-coupon-to-user-favorite-list"]}`, {
            couponId: coupon._id
        }).then(async (response) => {
            await this.changeFavoriteCouponsIds(coupon._id);
        });
    }
    onRemoveCouponFavorite = (couponId) => {
        axios('put', `${urls["coupons-remove-coupon-from-user-favorite-list"]}`, {
            couponId: couponId
        }).then(async (response) => {
            await this.changeFavoriteCouponsIds(couponId);
        });
    }
    onHideCoupon = (couponId) => {
        axios('put', `${urls["add-coupon-to-user-hidden-list"]}`, {
            couponId: couponId
        }).then((response) => {
            let section = {...this.state.section};
            let data = [...section.data];

            const couponIndex = data.findIndex((t) => t._id === couponId);

            data.splice(couponIndex, 1);

            section.data = data;

            this.setState({ section });
        }).catch((error) => {
            console.log('error: ', error.response)
        })
    }

    changeFavoriteCouponsIds = async (couponId) => {
        let favoriteCouponsIds = await getItemAsync('favoriteCouponsIds') || [];
        const indexCoupon = favoriteCouponsIds.indexOf(couponId);

        if (indexCoupon > -1) {
            favoriteCouponsIds.splice(indexCoupon, 1)
        } else {
            favoriteCouponsIds.push(couponId);
        }

        await setItemAsync('favoriteCouponsIds', favoriteCouponsIds);

        await this.onUpdateFavoriteCouponsIds();
    }

    onUpdateFavoriteCouponsIds = async () => {
        const favoriteCouponsIds = await getItemAsync('favoriteCouponsIds');

        this.setState({
            favoriteCouponsIds
        })
    }

    render() {
        return (
            <Page style={styles.page}>
                <HeaderAccounts title={this.state.section.title} {...this.props} styleRoot={{ marginBottom: 24 }}/>

                <SafeAreaView style={{flex: 1}}>
                    <FlatList
                        data={this.state.section.data}

                        contentContainerStyle={[commonStyles.container]}

                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}

                        renderItem={(item) => {
                            return (
                                <Coupon
                                    {...item.item}
                                    {...this.props}
                                    favoriteCouponsIds={this.state.favoriteCouponsIds}

                                    onAddCouponFavorite={this.onAddCouponFavorite}
                                    onRemoveCouponFavorite={this.onRemoveCouponFavorite}
                                    onHideCoupon={this.onHideCoupon}
                                />
                            )
                        }}
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

export default CouponsAll
