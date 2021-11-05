import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    SectionList,
    SafeAreaView, TouchableOpacity
} from 'react-native';
import {
    Page
} from "../../../components";
import {
    Coupon,
    Filter
} from "./components";
import {
    Icon
} from "native-base";
import {LoginHeader} from "../../../components";
import getHeightStatusBar from "../../../helper/getHeightStatusBar";
import commonStyles from "../../../theme/variables/commonStyles";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";


const statusBarHeight = getHeightStatusBar();

class OrganizationAllCoupons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            coupons: [],
            initialCoupons: [],
            categories: [],
            couponCategories: [],

            filter: {
                name: "",
                category: {}
            },
        };

        this.organization = this.props.company.company;
    }

    componentDidMount = async () => {
        await this.getCategories();
        await this.getCoupons();
    }

    getCategories = async () => {
        const couponCategories = await axios('get', `${urls["coupons-category-get"]}/${this.props.company?.company?._id}`).then((res) => {
            return res.data.data.couponCategories
        }).catch(() => {
            return []
        });

        await this.setState({couponCategories})
    }
    getCoupons = async () => {
        const url = `${urls['get-coupons']}${this.organization._id}?limit=200`;
        const coupons = await axios('get', url).then((response) => {
            return response.data.data.coupons
        }).catch(error => {
            return []
        });
        this.setSectionData(coupons);

        this.setState({
            isLoadingCoupons: false,
            initialCoupons: coupons,

        })
    }
    setSectionData = (coupons) => {
        const couponCategories = [
            {
                name: 'Без категории',
                _id: "not_category",
            },
            ...this.state.couponCategories
        ];

        let categories = couponCategories.map((item) => {
            return {
                ...item,
                data: [],
                title: item.name
            }
        });

        coupons.map((coupon) => {

            if ((coupon?.categories || []).length > 0) {

                coupon?.categories.map((categoryId) => {

                    let category = categories.find((t) => t._id === categoryId);
                    category.data.push(coupon);

                })

            } else {
                let category = categories.find((t) => t._id === ('not_category'));
                category.data.push(coupon);
            }

        });

        this.setState({categories});
    }

    filteredCoupon = () => {
        const { initialCoupons, filter } = this.state;
        let coupons = [...initialCoupons].filter((coupon) => {
            const couponName = coupon.name.toLowerCase();
            const filterName = filter.name.toLowerCase();
            const couponCategory = coupon.category || 'not_category';
            const filterCategory = filter.category?._id;

            const isAvaible = Boolean(couponName.indexOf(filterName) > -1 && Boolean(filterCategory) ? couponCategory === filterCategory : true);

            if (isAvaible) {
                return  coupon
            }
        });

        this.setSectionData(coupons);
    }
    onChangeFilter = (filter) => {
        this.setState({ filter }, () => {
            this.filteredCoupon();
        });
    }

    _routeCoupon = (couponId) => {
        this.props.navigation.navigate('OpenShareCompany', {
            couponId: couponId,
            isLoadingCoupon: true
        })
    }
    _routeCategory = (data) => {

        this.props.navigation.navigate("OrganizationCouponsCategory", {
            data: data
        })

    }

    render() {
        const {
            filter,
            categories
        } = this.state;
        const {
            company
        } = this.props;
        const organizationColor = company?.company?.colors?.primary;

        return (
            <Page style={[styles.page, {paddingTop: statusBarHeight}]}>

                <LoginHeader
                    title={allTranslations(localization.companyPagesOrganizationCoupons)}
                    styleRoot={{marginBottom: 0, paddingHorizontal: 12, marginTop: 16}}

                    isShowButtonBack

                    {...this.props}
                />

                <Filter
                    filter={filter}
                    categories={categories}
                    onChange={this.onChangeFilter}
                />

                <SafeAreaView style={{flex: 1}}>
                    <SectionList
                        contentContainerStyle={[commonStyles.container]}

                        sections={categories}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        stickySectionHeadersEnabled={false}
                        renderSectionHeader={({section}) => {

                            if (section.data.length <= 0) {
                                return null
                            }

                            return (
                                <TouchableOpacity style={styles.sectionHeader} onPress={() => this._routeCategory(section)}>
                                    <Text style={styles.sectionTitle}>
                                        {section.title}&nbsp;
                                        <Text style={{color:organizationColor}}>{section.data.length}</Text>
                                    </Text>

                                    <Icon name="arrow-right" type="Feather" style={{fontSize: 20, color: organizationColor}}/>
                                </TouchableOpacity>
                            )
                        }}
                        renderItem={(item) => {

                            if (item.index > 3) {
                                return null
                            }

                            return (
                                <Coupon
                                    coupon={item.item}
                                    routeOpenCoupon={this._routeCoupon}
                                    organizationColor={organizationColor}

                                    {...this.props}
                                />
                            )
                        }}
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

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    sectionTitle: {
        fontFamily: "AtypText_medium",
        fontSize: 18,
        lineHeight: 26,
        color: '#25233E'
    }
})

export default OrganizationAllCoupons
