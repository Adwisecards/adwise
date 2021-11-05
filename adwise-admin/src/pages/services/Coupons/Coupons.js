import React, { Component } from "react";
import {
    Box,
    Grid,
    Button,
    Typography,
} from "@material-ui/core";
import {
    Table,
    Filter
} from "./components";
import {store} from "react-notifications-component";
import queryString from "query-string";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import {getPageFromCount} from "../../../common/pagination";

class Coupons extends Component {
    constructor(props) {
        super(props);

        const searchString = this.props.history.location.search;
        const searchParams = queryString.parse(searchString);

        this.state = {
            coupons: [],

            filter: {
                sortBy: 'name',
                order: 1,

                pageSize: 20,
                pageNumber: 1,

                _id: searchParams._id || '',
                name: searchParams.name || '',
                type: searchParams.type || '',
                organization: searchParams.organization || '',
            },
            pagination: {
                countPages: 1
            },

            totalCountRows: 0,

            isLoading: true,
        };
    }

    componentDidMount = () => {
        this.props.history.replace('/coupons');

        this.getListCoupons();
    }

    getListCoupons = () => {
        this.setState({ isLoading: true });

        const searchUrl = this.getFilter();

        axiosInstance.get(`${ apiUrls["find-coupons"] }${ searchUrl }`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                coupons: response.data.data.coupons,
                totalCountRows: response.data.data.count,
                isLoading: false,
                pagination
            });
        })
    }
    getFilter = () => {
        const filter = {...this.state.filter};
        let filters = [];

        console.log('filterL ', filter)

        Object.keys(filter).map((key) => {
            if (!!filter[key]) {
                filters.push(`${ key }=${ filter[key] }`)
            }
            if (!filter[key]) {}
        });

        return `?${ filters.join('&') }`
    }

    onChangeFilter = (filter, isFastStart = false) => {
        this.setState({ filter }, () => {
            if (isFastStart) {
                this.getListCoupons();
            }
        });
    }

    render() {
        const { coupons, filter, pagination, isLoading } = this.state;

        return (
            <>

                <Box mb={4}>
                    <Typography variant="h1">Купоны</Typography>
                </Box>

                <Box mb={5}>
                    <Filter
                        filter={filter}
                        onSearch={this.getListCoupons}
                        onChange={this.onChangeFilter}
                    />
                </Box>

                <Box>
                    <Table
                        rows={coupons}
                        filter={filter}
                        pagination={pagination}
                        totalCountRows={this.state.totalCountRows}

                        isLoading={isLoading}

                        onChangeFilter={this.onChangeFilter}
                    />
                </Box>

            </>
        );
    }
}

export default Coupons
