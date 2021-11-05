import React, {Component} from "react";
import {
    Box,
    Typography
} from "@material-ui/core";
import {
    Table,
    Filter
} from "./components";

import {store} from "react-notifications-component";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import {getPageFromCount} from "../../../common/pagination";

class Tips extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tips: [],

            filter: {
                sortBy: 'timestamp',
                order: -1,

                pageSize: 20,
                pageNumber: 1,

                organization: ""
            },
            pagination: {},

            totalCountRows: 0,

            isLoading: true
        };
    }

    componentDidMount = () => {
        this.getListTips();
    }

    getListTips = () => {
        this.setState({isLoading: true});

        const searchUrl = this.getFilter();

        axiosInstance.get(`${ apiUrls["tips-find-tips"] }${ searchUrl }`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                tips: response.data.data.tips,
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
            if (!!filter[key]) {
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
                this.getListTips();
            }
        })
    }

    render() {
        const {
            tips,
            filter,
            pagination,
            isLoading,
            totalCountRows
        } = this.state;

        return (
            <>

                <Box mb={4}>
                    <Typography variant="h1">Чаевые</Typography>
                </Box>

                <Box mb={5}>
                    <Filter
                        filter={filter}

                        onSearch={this.getListTips}
                        onChange={this.onChangeFilter}
                    />
                </Box>

                <Box>
                    <Table
                        rows={tips}
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

export default Tips
