import React, { Component } from "react";
import {
    Backdrop,
    Box, Button, CircularProgress,
    Grid, Tooltip,
    Typography
} from "@material-ui/core";
import {
    Table,
    Filter
} from "./components";
import queryString from "query-string";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import {getPageFromCount} from "../../../common/pagination";
import {ExcelIcon} from "../../../icons";

class BankPayments extends Component {
    constructor(props) {
        super(props);

        const searchString = this.props.history.location.search;
        const searchParams = queryString.parse(searchString);

        this.state = {
            payments: [],

            filter: {
                sortBy: '_id',
                order: -1,

                pageSize: 20,
                pageNumber: 1,

                _id: searchParams._id || '',
                ref: searchParams.ref || '',
                paid: searchParams.paid || '',
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
        this.getPayments();
    }

    getPayments = () => {
        this.setState({ isLoading: true });

        const searchUrl = this.getFilter();

        axiosInstance.get(`${ apiUrls["find-payments"] }${ searchUrl }`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

           this.setState({
               payments: response.data.data.payments,
               totalCountRows: response.data.data.count,
               isLoading: false,
               pagination
           })
        });
    }
    getFilter = () => {
        const filter = {...this.state.filter};
        let filters = [];

        Object.keys(filter).map((key) => {
            if (
                !!filter[key] &&
                key !== 'paid'
            ) {
                filters.push(`${ key }=${ filter[key] }`)
            }

            if (key === 'paid' && filter[key] !== '') {
                filters.push(`paid=${ filter[key] }`);
            }
        });

        return `?${ filters.join('&') }`
    }

    onChangeFilter = (filter, isFastStart = false) => {
        this.setState({ filter }, () => {
            if (isFastStart) {
                this.getPayments();
            }
        });
    }

    onExport = () => {
        this.setState({isShowBackdrop: true});

        const filterSearch = this.getFilter();

        axiosInstance.get(`${apiUrls["find-payments"]}${filterSearch}&export=1`, {
                method: 'GET',
                responseType: 'blob'
            }
        ).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'bank-payments.xlsx');
            document.body.appendChild(link);
            link.click();

            this.setState({isShowBackdrop: false});
        }).catch(() => {
            this.setState({isShowBackdrop: false});
        })
    }

    render() {
        const { payments, filter, pagination, isLoading } = this.state;

        return (
            <>
                <Box mb={4}>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="h1">Банковские платежи</Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Выгрузить XLS">
                                <Button onClick={this.onExport}>

                                    <ExcelIcon/>

                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={5}>
                    <Filter
                        filter={filter}

                        onSearch={this.getPayments}
                        onChange={this.onChangeFilter}
                    />

                </Box>

                <Box>

                    <Table
                        rows={payments}
                        filter={filter}
                        pagination={pagination}
                        totalCountRows={this.state.totalCountRows}

                        isLoading={isLoading}

                        onChangeFilter={this.onChangeFilter}
                    />

                </Box>

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>
            </>
        );
    }
}

export default BankPayments
