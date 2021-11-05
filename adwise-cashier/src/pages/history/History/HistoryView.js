import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import {
    Page,
    LineTabs
} from "../../../components";
import {
    List,
    Header,
    Filter as FilterComponent
} from './components';
import WS from "react-native-websocket";
import axiosDefault from "axios";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import {getPageFromCount} from "../../../common/pagination";
import moment from "moment";

class History extends Component {
    constructor(props) {
        super(props);

        const account = props.app.account.contacts.find((account) => account.type === 'work');

        this.state = {
            purchases: [],

            filter: {
                page: 1,
                limit: 20,

                type: [],
                dateFrom: "",
                dateTo: "",
                refCode: "",
            },
            pagination: {
                pages: 0
            },
            cashierStat: {},

            sectionLoadStage: 0,

            isLoading: true,
            isResetFilter: true,
            isRefreshing: false,
            isOpenFilter: false,
            isModalLoading: false,
        }

        this.account = account;
        this.organizationId = account.organization._id || account.organization;

        this.timeoutStart = null;
    }

    componentDidMount = async () => {

        await this.onStart();
        await this.getCashierStat();

        this.props.navigation.addListener('didFocus', async () => {
            await this.onStart();
            await this.getCashierStat();
        });

    }

    onStart = async (isMore) => {
        const filter = {...this.state.filter};

        const isFilter = Boolean(filter.type.length > 0 || !!filter.dateFrom || !!filter.dateTo || !!filter.refCode);

        if ( isFilter ) {
            await this.getPurchases(isMore);
        } else {
            await this.getPurchasesSection();
        }
    }

    // Логика получения покупок
    getPurchasesSection = async () => {

        const listStatus = ['confirmed', 'processing', 'new'];
        const sectionLoadStage = this.state.sectionLoadStage;
        const title = Boolean(listStatus[sectionLoadStage] === 'confirmed') ? 'Оплачен' : Boolean(listStatus[sectionLoadStage] === 'processing') ? 'Ожидает оплаты' : 'Неоплачен';

        let purchases = [...this.state.purchases];

        const section = await axios('get', `${urls["get-purchases"]}${this.organizationId}?page=1&limit=500&types[]=${listStatus[sectionLoadStage]}`).then((response) => {
            return response.data.data.purchases
        });

        purchases.push({
            title,
            data: section
        })

        this.setState({
            purchases,
            sectionLoadStage: sectionLoadStage + 1,

            isLoading: false,
            isRefreshing: false,
            isResetFilter: false,
        })
    }
    getPurchases = async (isMore = false) => {

        this.setState({isLoading: true});

        const filter = this.getFilter();
        const purchasesOld = [...this.state.purchases?.[0]?.data || []];

        console.log('filter: ', filter);

        const {
            purchases: purchasesNew,
            count,
            error
        } = await axios('get', `${urls["get-purchases"]}${this.organizationId}${filter}`).then((response) => {
            return response.data.data
        }).catch((error) => {
            return {
                error: true
            }
        });

        console.log('purchasesNew: ', purchasesNew);

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
            purchases: [
                {
                    title: "",
                    data: [...purchases, ...purchasesNew]
                }
            ],
            pagination,
            isLoading: false,
            isRefreshing: false,
            isResetFilter: false,
        });

    }
    onRefresh = async () => {
        let filter = {...this.state.filter};
        filter.page = 1;

        this.setState({filter, isRefreshing: true, sectionLoadStage: 0}, async () => {
            await this.onStart();
        });
    }
    getFilter = () => {
        let filter = [];

        Object.keys(this.state.filter).map((key) => {
            let value = this.state.filter[key];

            if (
                !!value &&
                key !== 'type' &&
                key !== 'refCode' &&
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
                !!value && Boolean(
                key === 'dateFrom' ||
                key === 'dateTo'
                )
            ) {
                filter.push(`${key}=${moment(value).format('YYYY-MM-DD')}`);
            }

            if (
                !!value && Boolean(
                key === 'refCode'
                )
            ) {
                filter.push(`${key}=${value.replace(/\D+/g,"")}`);
            }


        })

        return `?${filter.join('&')}`
    }

    // Получение статистики кассира
    getCashierStat = async () => {
        const cashierStat = await axios('get', urls["cashier-purchase-statistics"]).then((response) => {
            return response.data.data
        });

        this.setState({cashierStat})
    }

    // Логика изменения фильтра
    onChangeFilter = (filter, isMore = false) => {
        let purchases = [...this.state.purchases];

        this.setState({
            filter,
            purchases: isMore ? purchases : [],
            sectionLoadStage: isMore ? this.state.sectionLoadStage : 0,
            isResetFilter: !isMore,
        }, async () => {

            this.timeoutStart = setTimeout(async () => {
                await this.onStart(isMore);
            }, 500);

        })
    }

    render() {
        const {
            filter,
            purchases,
            isLoading,
            pagination,
            isOpenFilter,
            isRefreshing,
            isModalLoading,
            cashierStat,
            isResetFilter,
            sectionLoadStage
        } = this.state;
        const isFilter = Boolean(filter.type.length > 0 || !!filter.dateFrom || !!filter.dateTo || !!filter.refCode);

        return (
            <Page style={styles.page}>

                <Header
                    stats={cashierStat}
                />

                <FilterComponent
                    filter={filter}
                    onChange={this.onChangeFilter}
                    onChangeOpen={(isOpenFilter) => this.setState({isOpenFilter})}
                />

                <View
                    pointerEvents={isOpenFilter ? 'none' : 'auto'}
                    style={{flex: 1}}
                >

                    <List
                        purchases={this.state.purchases}
                        isUpdateList={this.state.isUpdateList}
                        isShowButtonMore={this.state.isShowButtonMore}

                        filter={filter}
                        isFilter={isFilter}
                        pagination={pagination}
                        isLoading={isLoading}
                        isRefreshing={isRefreshing}
                        onRefresh={this.onRefresh}
                        onChangeFilter={this.onChangeFilter}
                        isResetFilter={isResetFilter}
                        sectionLoadStage={sectionLoadStage}

                        {...this.props}
                    />

                </View>

                <WS
                    url={`${urls["web-socket"]}${this.props.app.account._id}`}
                    onMessage={ async (event) => {
                        const messages = JSON.parse(event.data);

                        if (
                            messages.type === 'purchaseCreated' ||
                            messages.type === 'purchaseConfirmed' ||
                            messages.type === 'purchaseCompleted'
                        ) {
                            await this.onRefresh();
                        }
                    }}
                    reconnect
                />

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    buttonLoadMore: {
        width: '100%',
        height: 50,
        backgroundColor: '#8152E4',
        borderRadius: 6,

        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonLoadMoreText: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 18,
        color: 'white'
    },
})

export default History
