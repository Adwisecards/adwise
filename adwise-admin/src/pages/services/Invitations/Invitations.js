import React, { Component } from "react";
import {
    Box,
    Grid,
    Typography
} from "@material-ui/core";
import {
    Table as TableComponent,
    Filter as FilterComponent
} from "./components";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import {getPageFromCount} from "../../../common/pagination";
import moment from "moment";

class Invitations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [],

            filter: {
                pageNumber: 1,
                pageSize: 20,

                sortBy: 'timestamp',
                order: -1
            },
            pagination: {
                countPages: 1
            },

            totalCountRows: 0,

            isLoading: true
        };
    }

    componentDidMount = () => {
        this.getInvitations();
    }

    getInvitations = () => {
        this.setState({isLoading: true});

        const filter = this.getFilter();

        axiosInstance.get(`${apiUrls["invitations-find"]}${filter}`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                rows: response.data.data.invitations,
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
                filters.push(`${ key }=${ filter[key] }`)
            }
            if (
                !!filter[key] &&
                key === 'dateFrom' ||
                key === 'dateTo'
            ) {
                filters.push(`${ key }=${ moment(filter[key]).format('YYYY-MM-DD') }`)
            }
            if (!filter[key]) {}
        });

        return `?${ filters.join('&') }`
    }

    onChangeFilter = (filter, isFastStart = false) => {
        this.setState({ filter }, () => {
            if (isFastStart) {
                this.getInvitations();
            }
        })
    }

    render() {
        const {
            rows,
            filter,
            pagination,
            isLoading,
            totalCountRows
        } = this.state;

        return (
            <Box>

                <Box mb={3}>
                    <Typography variant="h1">Пользовательские приглашения</Typography>
                </Box>

                <Box mb={2}>
                    <FilterComponent
                        filter={filter}
                        onChange={this.onChangeFilter}
                        onSearch={this.getInvitations}
                    />
                </Box>

                <Box>
                    <TableComponent
                        rows={rows}
                        filter={filter}
                        pagination={pagination}
                        totalCountRows={totalCountRows}
                        isLoading={isLoading}

                        onChangeFilter={this.onChangeFilter}
                    />
                </Box>

            </Box>
        );
    }
}

export default Invitations
