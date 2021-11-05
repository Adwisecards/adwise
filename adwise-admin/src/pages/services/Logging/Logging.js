import React, { Component } from "react";
import {
    Box,
    Grid,
    Typography,
} from "@material-ui/core";
import {
    Filter,
    Table
} from "./components";

import {store} from "react-notifications-component";
import moment from "moment";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import {getPageFromCount} from "../../../common/pagination";

class Logging extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggings: [],
            eventNames: [],

            filter: {
                sortBy: 'timestamp',
                order: -1,

                pageSize: 20,
                pageNumber: 1,

                user: '',
                event: '',
                platform: '',
                isError: '',
                message: ''
            },
            pagination: {
                countPages: 1
            },

            isLoading: true
        };
    }

    componentDidMount = () => {
        this.getLoggings();
    }

    getLoggings = () => {
        this.setState({isLoading: true});

        const filter = this.getFilter();

        axiosInstance.get(`${ apiUrls["logs-find-logs"] }${ filter }`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                loggings: response.data.data.logs,
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
            if (!!filter[key]) {
                filters.push(`${key}=${filter[key]}`)
            }
            if (!filter[key]) {
            }
        });

        return `?${filters.join('&')}`
    }

    onChangeFilter = (filter, isFastStart) => {
        this.setState({ filter }, () => {
            if (isFastStart) {
                this.getLoggings()
            }
        })
    }

    render() {
        const { loggings, eventNames, filter, pagination, isLoading } = this.state;

        return (
            <>
                <Box mb={2}>
                    <Typography variant="h1">Логирование</Typography>
                </Box>

                <Box mb={3}>
                    <Filter
                        eventNames={eventNames}
                        filter={filter}
                        pagination={pagination}

                        onChange={this.onChangeFilter}
                        onSearch={this.getLoggings}
                    />
                </Box>

                <Box>
                    <Table
                        rows={loggings}
                        filter={filter}
                        pagination={pagination}
                        isLoading={isLoading}

                        onChangeFilter={this.onChangeFilter}
                    />
                </Box>
            </>
        );
    }
}

export default Logging
