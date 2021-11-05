import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity, RefreshControl,
} from 'react-native';
import {
    Page,
    HeaderAccounts
} from "../../../components";
import {
    Table
} from './components';
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import WS from "react-native-websocket";
import {getItemAsync} from "../../../helper/SecureStore";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import {getPageFromCount} from "../../../common/pagination";
import moment from "moment";


class MyPayments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [],
            listDisabledOrders: [],

            filter: {
                page: 1,
                limit: 20,

                type: ['archived'],
                dateFrom: "",
                dateTo: "",
            },
            pagination: {
                pages: 0
            },

            isLoading: true
        };
    }

    componentDidMount = async () => {
        await this.getPurchases();
    }

    // Логика получения покупок
    getPurchases = async (isMore = false) => {

        this.setState({isLoading: true});

        const filter = this.getFilter();
        const purchasesOld = [...this.state.rows];

        const {
            purchases: purchasesNew,
            count,
            error
        } = await axios('get', `${urls["get-user-purchases"]}${filter}`).then((response) => {

            console.log('response: ', response);

            return response.data.data
        }).catch((error) => {
            return {
                error: true
            }
        });

        if (error) {


            return null
        }

        let purchases = [];
        let pagination = {...this.state.pagination};
        pagination.pages = getPageFromCount(count, this.state.filter.limit);

        if (isMore) {
            purchases.push(...purchasesOld);
        }

        this.setState({
            purchases: [...purchases, ...purchasesNew],
            pagination,
            isLoading: false,
            isRefreshing: false,
        });

    }
    onRefresh = async () => {
        let filter = {...this.state.filter};
        filter.page = 1;

        this.setState({ filter, isRefreshing: true }, async () => {
            await this.getPurchases();
        });
    }
    getFilter = () => {
        let filter = [];

        Object.keys(this.state.filter).map((key) => {
            let value = this.state.filter[key];

            if (
                !!value &&
                key !== 'type' &&
                key !== 'dateFrom' &&
                key !== 'dateTo'
            ) {
                filter.push(`${key}=${value}`);
            }

            if (
                key === 'type' &&
                value.length > 0
            ) {
                value.map((value) => {
                    filter.push(`types[]=${value}`)
                })
            }

            if (
                !!value &&
                key === 'dateFrom' &&
                key === 'dateTo'
            ) {
                filter.push(`${key}=${moment(value).format('YYYY-MM-DD')}`);
            }


        })

        return `?${filter.join('&')}`
    }

    // Логика изменения фильтра
    onChangeFilter = (filter, isMore = false) => {
        this.setState({
            filter
        }, async () => {
            await this.getPurchases(isMore);
        })
    }

    render() {
        return (
            <Page style={styles.page}>
                <HeaderAccounts
                    title={ allTranslations(localization.paymentsTitleArchive) }

                    styleRoot={{ marginBottom: 10 }}

                    {...this.props}
                />

                <Table
                    rows={this.state.purchases}
                    listDisabledOrders={this.state.listDisabledOrders}

                    isLoading={this.state.isLoading}
                    refreshing={this.state.isLoading}
                    onRefresh={this.onRefresh}

                    onChangeListDisabledOrders={this.changeListDisabledOrders}

                    {...this.props}
                />

                <WS
                    ref={ref => {
                        this.webSocket = ref
                    }}
                    url={`${urls["web-socket"]}${this.props.app.account._id}`}
                    onMessage={async (event) => {
                        const messages = JSON.parse(event.data);

                        if (
                            messages.type === 'purchaseCreated' ||
                            messages.type === 'purchaseConfirmed'
                        ) {
                            await this.onRefresh();
                        }
                    }}
                    reconnect
                />
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

export default MyPayments
