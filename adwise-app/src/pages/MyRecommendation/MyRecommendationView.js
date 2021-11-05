import React, {Component} from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import commonStyles from "../../theme/variables/commonStyles";
import {
    Page,
    LoginHeader, DropDownHolder,
} from "../../components";
import {
    OrganizationCardLoading,
    SelectedOrganizations as SelectedOrganizationsComponent,
} from "./component";
import {
    ModalLoading
} from "../../components";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import {Icon} from "native-base";
import {
    ModalSort,
    OrganizationCard,
    Header as HeaderComponent,
    Filter as FilterComponent
} from "./component";
import {getPageFromCount} from "../../common/pagination";

class MyRecommendation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subscriptions: [],
            listRecommendation: [],
            categories: [],

            filter: {
                sortBy: 'clientLength',
                order: -1,
                page: 1,
                limit: 10,

                search: "",
                category: [],
            },
            pagination: {
                count: 1
            },

            isShowLoadingCard: true,
            isOpenModalLoading: false,
            isOpenFilter: false
        };

        this.refSort = React.createRef();
    }

    componentDidMount = async () => {
        await this.loadListRecommendation();
        await this.loadSelectedOrganizations();
        await this.getCategoriesOrganization();
    }

    loadListRecommendation = async (isMore) => {
        let activeCutaway = this.props.app.account.contacts.find(contact => contact._id === this.props.app.activeCutaway);
        let contacts = this.props.app.account.contacts[0];
        let pagination = {...this.state.pagination};
        let subscriptions = [];

        if (isMore) {
            subscriptions = [...this.state.subscriptions];
        }

        let contactId = (activeCutaway) ? activeCutaway._id : contacts._id;

        const search = this.getFilter();
        const {organizations, count} = await axios('get', `${urls["contact-get-organizations"]}/${contactId}${search}`).then((res) => {
            return res.data.data
        }).catch(() => {
            return []
        })

        pagination.count = getPageFromCount(count, this.state.filter.limit);

        this.setState({
            subscriptions: [...subscriptions, ...organizations],
            pagination
        })
    }
    getFilter = () => {
        const filter = {...this.state.filter};
        let search = [];

        Object.keys(filter).map((key) => {
            let value = filter[key];

            if (
                !!value &&
                key !== 'category'
            ) {
                search.push(`${key}=${filter[key]}`);
            }

            if (
                key === 'category' &&
                value.length > 0
            ) {
                value.map((item) => {
                    search.push(`categoryIds[]=${item}`);
                })
            }

        });

        console.log(`?${search.join('&')}`)

        return `?${search.join('&')}`
    }

    getCategoriesOrganization = async () => {
        const categories = await axios('get', urls["get-categories"]).then((response) => {
            return response.data.data.categories
        }).catch((error) => {
           return []
        });

        this.setState({
            categories
        })
    }

    loadSelectedOrganizations = async () => {
        const {account, activeCutaway} = this.props.app;
        const contactId = activeCutaway || account?.contacts[0]?._id;

        const listRecommendation = await axios('get', `${urls["organizations-get-user-favorite-organizations"]}?contactId=${contactId}`).then((res) => {
            return res.data.data.organizations
        }).catch(() => {
            return []
        });

        this.setState({
            listRecommendation
        })
    }

    onChangeFilter = (filter, isFastStart, isMore) => {
        this.refSort.current.close();

        let newFilter = {...this.state.filter, ...filter};

        this.setState({filter: newFilter}, async () => {
           if (isFastStart) {
               await this.loadListRecommendation(isMore);
           }
        });
    }

    onAddSelectedOrganization = async (organizationId) => {
        const isValid = this.state.listRecommendation.length < 5;

        if (!isValid) {
            DropDownHolder.alert(
                'warn',
                'Системное уведомление',
                'Вы не можете добавить в избранное больше 5-ти организаций'
            )

            return null
        }

        let activeCutaway = this.props.app.account.contacts.find(contact => contact._id === this.props.app.activeCutaway);
        let contacts = this.props.app.account.contacts[0];
        let contactId = (activeCutaway) ? activeCutaway._id : contacts._id;

        this.setState({isOpenModalLoading: true});

        axios('put', `${urls["organizations-add-organization-to-user-favorite-list"]}`, {
            contactId,
            organizationId
        }).then( async (response) => {

            await this.loadSelectedOrganizations();

            this.setState({isOpenModalLoading: false});

        }).catch((error) => {

            this.setState({isOpenModalLoading: false});

            DropDownHolder.alert(
                'error',
                'Ошибка добавление',
                'Не удалось добавить организацию в избранное'
            );

        });
    }
    onRemoveSelectedOrganization = (organizationId) => {
        let activeCutaway = this.props.app.account.contacts.find(contact => contact._id === this.props.app.activeCutaway);
        let contacts = this.props.app.account.contacts[0];
        let contactId = (activeCutaway) ? activeCutaway._id : contacts._id;

        this.setState({isOpenModalLoading: true});

        axios('put', `${urls["organizations-remove-organization-from-user-favorite-list"]}`, {
            contactId,
            organizationId
        }).then( async (response) => {

            await this.loadSelectedOrganizations();

            this.setState({isOpenModalLoading: false});

        }).catch((error) => {

            this.setState({isOpenModalLoading: false});

            DropDownHolder.alert(
                'error',
                'Ошибка добавление',
                'Не удалось удалить организацию из избранного'
            );

        });
    }

    _routeGoBack = () => {
        this.props.navigation.goBack();
    }
    _routePageCompany = (organizationId) => {
        this.props.navigation.navigate('CompanyPageMain', {
            organizationId,
        })
    }
    _modalizeOpenSort = () => {
        this.refSort.current.open();
    }
    _loadMore = () => {
        let filter = {...this.state.filter};

        filter.page++

        if (filter.page > this.state.pagination.count) {
            this.setState({isShowLoadingCard: false});

            return null
        }

        this.onChangeFilter(filter, true, true)
    }


    render() {
        const {
            filter,
            subscriptions,
            isShowLoadingCard,
            listRecommendation,
            categories,
            isOpenFilter
        } = this.state;

        return (
            <Page style={styles.page}>
                <HeaderComponent
                    goBack={this._routeGoBack}
                    openSort={this._modalizeOpenSort}
                />

                <FilterComponent
                    filter={filter}
                    categories={categories}
                    onChange={this.onChangeFilter}
                    onChangeOpen={(isOpenFilter) => this.setState({isOpenFilter})}
                />

                <View pointerEvents={isOpenFilter ? 'none' : 'auto'} style={[commonStyles.container, {zIndex: isOpenFilter ? -1 : 1, flex: 1, paddingBottom: 0, paddingTop: 0}]}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <FlatList
                            data={this.state.subscriptions}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            onEndReached={this._loadMore}
                            style={{marginHorizontal: -12}}
                            contentContainerStyle={{paddingBottom: 20, paddingHorizontal: 12}}
                            renderItem={(item) => {
                                const isFavorite = Boolean(listRecommendation.find((_item) => _item._id === item.item._id));

                                return (
                                    <OrganizationCard
                                        organization={item.item}
                                        isFavorite={isFavorite}

                                        onAddSelected={this.onAddSelectedOrganization}
                                        onRemoveSelected={this.onRemoveSelectedOrganization}
                                        routeCompany={this._routePageCompany}
                                    />
                                )
                            }}

                            ListHeaderComponent={() => (
                                <SelectedOrganizationsComponent
                                    list={listRecommendation}
                                    routeCompany={this._routePageCompany}
                                />
                            )}
                            ListFooterComponent={() => {
                                if (!isShowLoadingCard) {
                                    return null
                                }

                                return (
                                    <OrganizationCardLoading/>
                                )
                            }}
                        />
                    </SafeAreaView>
                </View>

                <ModalSort
                    innerRef={this.refSort}
                    filter={filter}
                    onChangeFilter={this.onChangeFilter}
                />

                <ModalLoading
                    isOpen={this.state.isOpenModalLoading}
                />

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})
const stylesHeader = StyleSheet.create({
    root: {
        flexDirection: 'row'
    },

    rootContainerTitle: {
        flex: 1,
        // alignItems: 'center'
    },
    rootTitle: {
        fontSize: 26,
        lineHeight: 26,
        marginTop: 4,
        color: 'black',
        // textAlign: 'center',
        fontFamily: 'AtypText_medium'
    },

    rootLeft: {
        width: 45,
        height: 45,

        marginTop: -8,
        marginLeft: -8,

        justifyContent: 'center',
        alignItems: 'center'
    },
    rootRight: {
        width: 45,
        height: 45,

        marginTop: -8,
        marginRight: -8,

        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonBack: {
        margin: -16,
        padding: 16
    }
})

export default MyRecommendation
