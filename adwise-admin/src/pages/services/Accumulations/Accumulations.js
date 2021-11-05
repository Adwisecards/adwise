import React, { Component } from "react";
import {
    Box,
    Typography,
} from "@material-ui/core";
import {
    Table as TableComponent,
    Filter as FilterComponent
} from "./components";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import {getPageFromCount} from "../../../common/pagination";

class Accumulations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [],

            filter: {
                accumulationId: "",
                closed: "",
                user: "",

                sortBy: 'timestamp',
                order: 1,

                pageSize: 20,
                pageNumber: 1,
            },
            pagination: {
                countPages: 1
            },

            totalCountRows: 0,

            isLoading: true
        };
    }

    componentDidMount = () => {
        this.getAccumulations();
    }

    getAccumulations = () => {
        this.setState({ isLoading: true });

        const searchUrl = this.getFilter();

        axiosInstance.get(`${ apiUrls["accumulations-find"] }${ searchUrl }`).then(async (response) => {
            let accumulations = [...response.data.data.accumulations];
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                rows: accumulations,
                totalCountRows: response.data.data.count,
                isLoading: false,
                pagination
            });
        })
    }
    getFilter = () => {
        const filter = {...this.state.filter};
        let filters = [];

        Object.keys(filter).map((key) => {
            if (!!filter[key]) {
                filters.push(`${ key }=${ filter[key] }`)
            }
            if (!filter[key]) {}
        });

        return `?${ filters.join('&') }`
    }

    onChangeFilter = (filter, isFastStart) => {
        this.setState({filter}, () => {
            if (isFastStart) {
                this.getAccumulations();
            }
        })
    }

    render() {
        const { rows, filter, pagination, isLoading, totalCountRows } = this.state;

        return (
            <>

                <Box mb={3}>
                    <Typography variant="h3">Копилки организаций <Typography variant="caption">(Только Безопасная сделка)</Typography></Typography>
                </Box>

                <Box mb={2}>
                    <FilterComponent
                        filter={filter}
                        onSearch={this.getAccumulations}
                        onChange={this.onChangeFilter}
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

            </>
        );
    }
}

export default Accumulations
