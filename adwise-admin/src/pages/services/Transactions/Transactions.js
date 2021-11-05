import React, {Component} from "react";
import {
    Box,

    Typography,

    Grid, CircularProgress, Backdrop, Button, Tooltip
} from "@material-ui/core";
import {
    Table,
    Filter
} from "./components";
import queryString from "query-string";

import {store} from "react-notifications-component";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import alertNotification from "../../../common/alertNotification";
import {ExcelIcon} from "../../../icons";
import {getPageFromCount} from "../../../common/pagination";
import moment from "moment";

class Transactions extends Component {
    constructor(props) {
        super(props);

        const searchString = this.props.history.location.search;
        const searchParams = queryString.parse(searchString);

        this.state = {
            transactions: [],

            filter: {
                sortBy: 'timestamp',
                order: -1,

                pageSize: 20,
                pageNumber: 1,

                to: searchParams.to || '',
                from: searchParams.from || '',
                origin: searchParams.origin || '',
                disabled: searchParams.disabled || true,
                type: searchParams.type || '',
                dateFrom: searchParams.dateFrom || null,
                dateTo: searchParams.dateTo || null,
                context: searchParams.context || '',
                'organization._id': searchParams.organization || '',
                'from|to': searchParams['from|to'] || ''
            },
            pagination: {
                countPages: 1
            },

            totalCountRows: 0,

            isLoading: true,
            isShowBackdrop: false
        };
    }

    componentDidMount = () => {
        this.props.history.replace('/transactions');

        this.getListTransactions();
    }

    getListTransactions = (isShowLoading = true) => {
        if (isShowLoading) {
            this.setState({isLoading: true});
        }

        const searchUrl = this.getFilter();

        axiosInstance.get((`${apiUrls["find-transactions"]}${searchUrl}`)).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                transactions: response.data.data.transactions,
                totalCountRows: response.data.data.count,
                isLoading: false,
                pagination
            })
        });
    }
    getFilter = () => {
        const filter = {...this.state.filter};
        let filters = [];

        console.log('filter: ', filter)

        Object.keys(filter).map((key) => {
            if (
                !!filter[key] &&
                key !== "dateFrom" &&
                key !== "disabled" &&
                key !== "dateTo"
            ) {
                filters.push(`${key}=${filter[key]}`)
            }
            if (key === 'dateFrom' || key === 'dateTo') {
                if (!!filter[key]) {
                    filters.push(`${key}=${moment(filter[key]).format('YYYY-MM-DD')}`)
                }
            }
            if (key === 'disabled' && filter[key] !== "" && !filter[key]) {
                filters.push(`${key}=${filter[key]}`)
            }
            if (!filter[key]) {
            }
        });

        return `?${filters.join('&')}`
    }

    onChangeFilter = (filter, isFastStart) => {
        this.setState({filter}, () => {
            if (isFastStart) {
                this.getListTransactions();
            }
        })
    }

    onDisabledTransaction = (row) => {
        this.setState({isShowBackdrop: true});

        axiosInstance.put(`${apiUrls["set-transaction-disabled"]}/${row._id}`, {
            disabled: !row.disabled
        }).then((response) => {
            this.setState({
                isShowBackdrop: false
            });

            alertNotification({
                title: 'Системное уведомление',
                message: `Транзакция успешно ${!row.disabled ? 'отключена' : 'включена'}`,
                type: 'success'
            });

            this.getListTransactions(false);
        }).catch((error) => {
            this.setState({isShowBackdrop: false});

            alertNotification({
                title: 'Системное уведомление',
                message: `Ошибка ${!row.disabled ? 'отключения' : 'включения'} транзакции`,
                type: 'danger'
            })
        })
    }

    onExportTransaction = () => {
        this.setState({isShowBackdrop: true});

        const filterSearch = this.getFilter();

        axiosInstance.get(`${apiUrls["find-transactions"]}${filterSearch}&export=1`, {
                method: 'GET',
                responseType: 'blob'
            }
        ).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'transactions.xlsx');
            document.body.appendChild(link);
            link.click();

            this.setState({isShowBackdrop: false});
        }).catch(() => {
            this.setState({isShowBackdrop: false});
        })
    }

    render() {
        const {transactions, pagination, filter, isLoading} = this.state;

        return (
            <>

                <Box mb={4}>
                    <Grid container justify="space-between">

                        <Grid item>
                            <Typography variant="h1">Транзакции</Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Выгрузить XLS">
                                <Button onClick={this.onExportTransaction}>

                                    <ExcelIcon/>

                                </Button>
                            </Tooltip>
                        </Grid>

                    </Grid>
                </Box>

                <Box mb={5}>
                    <Filter
                        filter={filter}

                        onSearch={this.getListTransactions}
                        onChange={this.onChangeFilter}
                    />
                </Box>

                <Box>
                    <Table
                        rows={transactions}
                        filter={filter}
                        pagination={pagination}
                        totalCountRows={this.state.totalCountRows}

                        isLoading={isLoading}

                        onChangeFilter={this.onChangeFilter}
                        onDisabledTransaction={this.onDisabledTransaction}
                    />
                </Box>

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default Transactions
