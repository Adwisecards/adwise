import React, {Component} from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import {
    Header as HeaderComponent,
    Filter as FilterComponent
} from "./components";
import {Page} from "../../../components";
import getHeightStatusBar from "../../../helper/getHeightStatusBar";
import commonStyles from "../../../theme/variables/commonStyles";
import {Icon} from "native-base";
import {Coupon} from "../OrganizationAllCoupons/components";

const heightStatusBar = getHeightStatusBar();

class OrganizationCouponsCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sections: [],

            filter: {
                name: ""
            },

            ...props.navigation?.state?.params?.data || {},
        }
    }

    componentDidMount = () => {}

    _routeGoBack = () => {
        this.props.navigation.goBack();
    }
    _getCoupons = () => {
        const { filter, data } = this.state;

        return [...data].filter((coupon) => coupon.name.toLowerCase().indexOf(filter.name.toLowerCase()) > -1)
    }
    _routeCoupon = (couponId) => {
        this.props.navigation.navigate('OpenShareCompany', {
            couponId: couponId,
            isLoadingCoupon: true
        })
    }

    render() {
        const {
            name: categoryName,
            sections,
            filter
        } = this.state;
        const {
            company
        } = this.props;

        const organizationName = company?.company?.name;
        const organizationColor = company?.company?.colors?.primary;

        return (
            <Page style={styles.page}>

                <HeaderComponent
                    organizationName={organizationName}
                    organizationColor={organizationColor}
                    categoryName={categoryName}

                    routeGoBack={this._routeGoBack}
                />

                <FilterComponent
                    filter={filter}
                    onChange={(filter) => this.setState({filter})}
                />

                <SafeAreaView style={{flex: 1}}>
                    <FlatList
                        contentContainerStyle={[commonStyles.container]}
                        data={this._getCoupons()}
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
        flex: 1,
        paddingTop: heightStatusBar
    },
})

export default OrganizationCouponsCategory
