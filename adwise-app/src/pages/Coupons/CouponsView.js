import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SectionList,
    SafeAreaView,
    FlatList
} from 'react-native';
import {
    Page,
    Coupon,
    CouponLoading,
    LoginHeader,
    RefreshControl,
    HeaderControlsButtons
} from "../../components";
import {
    // Coupon,
    Header,
    Filter,
    PinnedCoupons
} from './components';
import commonStyles from "../../theme/variables/commonStyles";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import Contact from "../Contacts/components/Contact";
import {Icon} from "native-base";
import {setItemAsync} from "../../helper/SecureStore";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

class Coupons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',

            initialCoupons: [],
            couponsSearch: [],
            listSections: [],
            favoriteCoupons: [],
            favoriteCouponsIds: [],
            hiddenCoupons: [],
            couponsCategories: [],

            filter: {
                coupon: "",
                active: "",
                availability: "",
                categories: [],
                sort: "",
            },

            isLoadInitial: true,
            isLoadCategories: false,
            isLoadingCouponsSearch: true,
            isOpenFilter: false
        };

        this.intervalSearchCoupons = null;
    }

    componentDidMount = async () => {
        this.loadUserCoupons();
        this.getListFavoritesCoupons();
        this.getDisabledCoupons();

        this.props.navigation.addListener('didFocus', async () => {
            this.loadUserCoupons();
            this.getListFavoritesCoupons();
            this.getDisabledCoupons();
        });
    }

    loadUserCoupons = () => {
        axios('get', urls['get-user-coupons']).then((response) => {
            const coupons = response.data.data.coupons;

            this.setState({
                initialCoupons: coupons
            }, () => {
                this.getCategoriesCoupons();
                this.initCouponsCategories();
            })
        });
    }
    initCouponsCategories = () => {
        const coupons = this.getSortedCoupons();

        let couponsCategories = [];

        coupons.map((coupon, idx) => {
            if (!Boolean(couponsCategories.find((t) => t.value === coupon.organization.category._id))) {
                couponsCategories.push({
                    title: coupon.organization.category.name,
                    value: coupon.organization.category._id
                })
            }
        });

        this.setState({
            couponsCategories
        })
    }
    getCategoriesCoupons = () => {
        const coupons = this.getSortedCoupons();

        let categoriesObject = {};
        let listSections = [];

        coupons.map((coupon, idx) => {
            const isHidden = this.state.hiddenCoupons.indexOf(coupon._id) > -1;
            const isFilter = this.checkCouponFilter(coupon);

            if (!isHidden && isFilter) {
                if (!categoriesObject[coupon.organizationCategory]) {
                    categoriesObject[coupon.organizationCategory] = {
                        id: `${idx}`,
                        title: coupon.organizationCategory,
                        data: []
                    }
                }
                categoriesObject[coupon.organizationCategory]['data'].push(coupon);
            }
        });

        Object.keys(categoriesObject).map((key) => {
            listSections.push(categoriesObject[key])
        });

        this.setState({
            listSections,
            isLoadInitial: false,
            isLoadCategories: false
        })
    }
    checkCouponFilter = (coupon) => {
        let boolean = true;
        const filter = {...this.state.filter};

        if (filter.coupon !== "") {
            boolean = Boolean(coupon.name.toLowerCase().indexOf(filter.coupon.toLowerCase()) > -1);
        }
        if (filter.active !== "") {
            boolean = Boolean(filter.active === (!coupon.disabled && !coupon.organization.disabled));
        }
        if (filter.availability !== "") {
            boolean = Boolean(filter.availability === Boolean(coupon.quantity > 0));
        }
        if (filter.categories.length > 0) {
            boolean = Boolean(filter.categories.includes(coupon.organization.category._id));
        }

        return boolean
    }
    getSortedCoupons = () => {
        const filter = {...this.state.filter};
        let coupons = [...this.state.initialCoupons];

        if (filter.sort !== "") {

            if ( filter.sort === "cashback" ) {
                coupons.sort((a, b) => {
                    if ( a.offer.percent < b.offer.percent ) {
                        return 1
                    }
                    if ( a.offer.percent > b.offer.percent ) {
                        return -1
                    }

                    return 0
                })
            }
            if ( filter.sort === "-cashback" ) {
                coupons.sort((a, b) => {
                    if ( a.offer.percent < b.offer.percent ) {
                        return -1
                    }
                    if ( a.offer.percent > b.offer.percent ) {
                        return 1
                    }

                    return 0
                })
            }

            if ( filter.sort === 'price' ) {
                coupons.sort((a, b) => {
                    if ( a.price < b.price ) {
                        return 1
                    }
                    if ( a.price > b.price ) {
                        return -1
                    }

                    return 0
                })
            }
            if ( filter.sort === '-price' ) {
                coupons.sort((a, b) => {
                    if ( a.price < b.price ) {
                        return -1
                    }
                    if ( a.price > b.price ) {
                        return 1
                    }

                    return 0
                })
            }

        }

        return coupons;
    }

    onSearchCoupons = () => {
        clearInterval(this.intervalSearchCoupons);

        const searchUrl = this.onGetFilterSearchCoupons();

        axios('get', `${urls["user-find-coupons"]}${searchUrl}`).then((response) => {
            this.setState({
                couponsSearch: response.data.data.coupons,
                isLoadingCouponsSearch: false
            })
        });
    }
    onGetFilterSearchCoupons = () => {
        const filter = [
            `limit=20`,
            `page=1`,
            `search=${this.state.search}`
        ];

        return `?${filter.join('&')}`
    }
    onChangeSearch = (search) => {
        clearTimeout(this.intervalSearchCoupons);

        this.setState({
            search,
            couponsSearch: [],
            isLoadingCouponsSearch: true
        }, () => {
            this.intervalSearchCoupons = setTimeout(() => {
                this.onSearchCoupons();
            }, 100);
        })
    }

    getDisabledCoupons = () => {
        axios('get', urls["get-user-hidden-coupons"]).then((response) => {
            const hiddenCoupons = response.data.data.coupons.map((coupon) => coupon._id);

            this.setState({hiddenCoupons}, () => {
                this.getCategoriesCoupons();
            })
        });
    }

    getListFavoritesCoupons = () => {
        axios('get', `${urls["coupons-get-user-favorite-coupons"]}`).then(async (response) => {
            const favoriteCoupons = response.data.data.coupons;
            const favoriteCouponsIds = favoriteCoupons.map((coupon) => {
                return coupon._id
            });

            await setItemAsync('favoriteCouponsIds', favoriteCouponsIds);

            this.setState({
                favoriteCoupons,
                favoriteCouponsIds
            });

            this.props.updateFavorites(favoriteCoupons);
        });
    }
    onAddCouponFavorite = (coupon) => {
        axios('put', `${urls["coupons-add-coupon-to-user-favorite-list"]}`, {
            couponId: coupon._id
        }).then((response) => {
            this.getListFavoritesCoupons();
        });
    }
    onRemoveCouponFavorite = (couponId) => {
        axios('put', `${urls["coupons-remove-coupon-from-user-favorite-list"]}`, {
            couponId: couponId
        }).then((response) => {
            this.getListFavoritesCoupons();
        });
    }

    onHideCoupon = (couponId) => {
        const {favoriteCouponsIds} = this.state;

        axios('put', `${urls["add-coupon-to-user-hidden-list"]}`, {
            couponId: couponId
        }).then((response) => {
            this.getDisabledCoupons();

            if (favoriteCouponsIds.includes(couponId)) {
                this.onRemoveCouponFavorite(couponId);
            }
        })
    }

    onChangeFilter = (filter) => {
        this.setState({
            filter
        }, () => {
            this.getCategoriesCoupons();
        })
    }

    _routeToAllCategory = (section) => {
        this.props.navigation.push('CouponsAll', {
            section
        })
    }

    render() {
        const {
            filter,
            isOpenFilter,
            couponsCategories
        } = this.state;

        return (
            <Page style={[styles.page]}>
                <Header
                    title={allTranslations(localization.myCouponsTitle)}
                />

                <Filter
                    filter={filter}
                    onChange={this.onChangeFilter}
                    onChangeOpen={(isOpenFilter) => this.setState({isOpenFilter})}
                    couponsCategories={couponsCategories}
                />

                <View style={{zIndex: isOpenFilter ? -1 : 1, flex: 1}}>
                    <SafeAreaView style={{flex: 1}}>

                        <SectionList
                            contentContainerStyle={[commonStyles.container]}

                            sections={this.state.listSections}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            stickySectionHeadersEnabled={false}

                            keyExtractor={(coupon, index) => `${coupon._id}-${index}`}
                            renderSectionHeader={({section}) => {
                                return (
                                    <TouchableOpacity style={styles.sectionHeader}
                                                      onPress={() => this._routeToAllCategory(section)}>
                                        <Text
                                            style={styles.sectionTitle}>{section.title} ({section.data.length})</Text>


                                        {
                                            (section.data.length > 3) && (
                                                <View style={styles.sectionButtonArrow}>
                                                    <Icon style={[styles.sectionArrow, {color: '#8152E4'}]}
                                                          name={'arrow-forward'} type={'MaterialIcons'}/>
                                                </View>
                                            )
                                        }
                                    </TouchableOpacity>
                                )
                            }}
                            renderItem={(item) => {
                                if (item.index > 2) {
                                    return null
                                }

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
                            ListHeaderComponent={() => {
                                return (
                                    <PinnedCoupons
                                        items={this.state.favoriteCoupons}
                                        props={this.props}
                                    />
                                )
                            }}
                            ListFooterComponent={() => {
                                if (!this.state.isLoadCategories && !this.state.isLoadInitial) {
                                    return null
                                }

                                return (
                                    <>
                                        <View style={{marginBottom: 12}}><CouponLoading/></View>
                                        <View style={{marginBottom: 12}}><CouponLoading/></View>
                                        <View style={{marginBottom: 12}}><CouponLoading/></View>
                                        <View style={{marginBottom: 12}}><CouponLoading/></View>
                                    </>
                                )
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isLoadCategories}
                                    onRefresh={this.loadUserCoupons}
                                />
                            }
                        />
                    </SafeAreaView>
                </View>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    sectionTitle: {
        flex: 1,
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 25,
    },
    sectionButtonArrow: {
        width: 50,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',

        marginRight: -12
    },
    sectionArrow: {
        fontSize: 20
    },
})

export default Coupons
