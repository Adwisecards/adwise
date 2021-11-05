import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    Icon
} from "native-base";
import {
    Header as HeaderComponent,
    Filter as FilterComponent,
    List as ListComponent,
    Map as MapComponent
} from "./components";
import {
    Page
} from "../../components";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            organizations: [],
            organizationsList: [],
            categories: [],

            filter: {
                page: 1,
                limit: 999,

                search: "",
                category: [],
            },
            pagination: {},

            view: "list",

            isLoading: true,
            isOpenFilter: false,
        }
    }

    componentDidMount = async () => {

        await this.getOrganizations();
        await this.getCategories();

    }

    // Получения списка организации
    getOrganizations = async () => {

        const filter = this.getFilter();

        const organizations = await axios('get', `${ urls['find-organizations'] }${ filter }`).then((response) => {
            return response.data.data.organizations
        }).catch((error) => {
            return []
        });

        // Получения секций организаций
        let sections = [];
        organizations.map((organization) => {
            const isContributed = Boolean(sections.find((t) => t._id === organization.category._id));

            if (!isContributed) {
                sections.push({
                    _id: organization.category._id,
                    title: organization.category.name,
                    data: []
                })
            }
            let section = sections.find((t) => t._id === organization.category._id);
            section.data.push(organization);
        });

        this.setState({
            organizations: sections,
            organizationsList: organizations
        })
    }
    getFilter = () => {
        const filter = {...this.state.filter};
        let search = [];

        Object.keys(filter).map((key) => {
            let value = filter[key];

            if (
                !!value &&
                key !== 'category' &&
                key !== 'search'
            ) {
                search.push(`${key}=${filter[key]}`);
            }

            if (
                key === 'search'
            ) {
                search.push(`${key}=${filter[key] || '.'}`);
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
    onChangeFilter = (filter) => {
        this.setState({
            filter
        }, async () => {
            await this.getOrganizations();
        });
    }

    // Получения списка категорий для фильтра
    getCategories = async () => {

        const categories = await axios('get', urls["get-categories"]).then((response) => {
            return response.data.data.categories
        }).catch((error) => {
            return []
        })

        this.setState({ categories });

    }

    _routeGoBack = () => {
        this.props.navigation.goBack();
    }
    _routeGoOrganization = (organizationId) => {
        this.props.navigation.navigate('CompanyPageMain', {
            organizationId: organizationId
        })
    }

    render() {
        const {
            organizations,
            organizationsList,
            filter,
            categories,
            isOpenFilter,
            isLoading,
            view
        } = this.state;

        return (
            <Page>

                <HeaderComponent
                    goBack={this._routeGoBack}
                />

                <FilterComponent
                    filter={filter}
                    categories={categories}
                    view={view}
                    onChange={this.onChangeFilter}
                    onChangeView={(view) => this.setState({view})}
                    onChangeOpen={(isOpenFilter) => this.setState({isOpenFilter})}
                />

                <View
                    pointerEvents={isOpenFilter ? 'none' : 'auto'}
                    style={{flex: 1, zIndex: isOpenFilter ? -1 : 1}}
                >
                    {
                        Boolean(view === 'list') ? (
                            <ListComponent sections={organizations} isLoading={isLoading} routeOrganization={this._routeGoOrganization}/>
                        ) : (
                            <MapComponent
                                coordinateMarkers={organizationsList}
                                navigation={this.props.navigation}
                            />
                        )
                    }
                </View>

            </Page>
        );
    }

}

export default Search
