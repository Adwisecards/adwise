import React, { Component } from "react";
import {
    Box,
    Grid,
    Container,
    Typography
} from "@material-ui/core";
import {
    Filter,
    Table
} from "./components";
import axiosInstance from "../../../agent/agent";
import {getPageFromCount} from "../../../common/pagination";
import apiUrls from "../../../constants/apiUrls";
import moment from "moment";

class ReferralCodes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [],

            filter: {
                sortBy: 'timestamp',
                order: -1,

                pageSize: 20,
                pageNumber: 1,

                _id: '',
                code: '',
                user: '',
                type: '',
                mode: '',
                dateFrom: '',
                dateTo: ''
            },
            pagination: {
                countPages: 1
            },

            isLoading: true
        };
    }

    componentDidMount = () => {
        this.gerReferralCodes();
    }

    gerReferralCodes = () => {
        this.setState({ isLoading: true });

        const filter = this.getFilter();

        axiosInstance.get(`${apiUrls["refs-find-refs"]}${ filter }`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                rows: response.data.data.refs,
                totalCountRows: response.data.data.count,
                isLoading: false,
                pagination
            })
        })
    }
    getFilter = () => {
        const filter = {...this.state.filter};
        let filters = [];

        Object.keys(filter).map((key) => {
            if (
                !!filter[key] &&
                key !== 'dateFrom' &&
                key !== 'dateTo'
            ) {
                filters.push(`${key}=${filter[key]}`)
            }
            if (!filter[key]) {
            }
            if (!!filter[key] &&
                (key === 'dateFrom' ||
                key === 'dateTo')
            ) {
                filters.push(`${key}=${moment(filter[key]).format('YYYY-MM-DD')}`)
            }
        });

        return `?${filters.join('&')}`
    }

    onChangeFilter = (filter, isFastStart) => {
        this.setState({ filter }, () => {
            if (isFastStart) {
                this.gerReferralCodes();
            }
        })
    }

    render() {
        const {rows, pagination, filter, totalCountRows, isLoading} = this.state;

        return (
            <>
                <Box mb={2}>
                    <Typography variant="h1">Реферальные коды</Typography>
                </Box>

                <Box mb={3}>
                    <Filter filter={filter} onChange={this.onChangeFilter} onSearch={this.gerReferralCodes}/>
                </Box>

                <Box>
                    <Table
                        rows={rows}
                        filter={filter}
                        pagination={pagination}
                        totalCountRows={totalCountRows}

                        isLoading={isLoading}

                        onChangeFilter={this.onChangeFilter}
                    />
                </Box>

            </>
        );
    }
}

export default ReferralCodes
