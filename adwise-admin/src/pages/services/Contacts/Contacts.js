import React, { Component } from "react";
import {
    Box,
    Grid,
    Button,
    Tooltip,
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
import queryString from "query-string";

class Contacts extends Component {
    constructor(props) {
        super(props);

        const searchString = this.props.history.location.search;
        const searchParams = queryString.parse(searchString);

        this.state = {
            rows: [],

            filter: {
                sortBy: 'timestamp',
                order: -1,

                _id: searchParams._id || '',
                ref: searchParams.ref || '',
                type: searchParams.type || '',
                organization: searchParams.organization || '',

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

        this.props.history.replace('/contacts');

        this.getContacts();
    }

    getContacts = () => {
        this.setState({
            isLoading: true,
            rows: []
        })

        const searchUrl = this.getFilter();

        axiosInstance.get(`${ apiUrls["contacts-find-contacts"] }${ searchUrl }`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                rows: response.data.data.contacts,
                totalCountRows: response.data.data.count,
                isLoading: false,
                pagination
            })
        })
    }
    getFilter = () => {
        let filterList = [];
        const filter = {...this.state.filter};

        Object.keys(filter).map((key) => {
            const value = filter[key];

            if (!!value) {
                filterList.push(`${ key }=${ value }`);
            }
        });

        return `?${ filterList.join('&') }`
    }
    onChangeFilter = (filter, isFastStart = false) => {
        this.setState({ filter }, () => {
            if (isFastStart) {
                this.getContacts();
            }
        });
    }


    render() {
        const {
            rows,
            filter,
            isLoading,
            pagination,
            totalCountRows
        } = this.state;

        return (
            <>

                <Box mb={2}>
                    <Typography variant="h1">Визитные карточки</Typography>
                </Box>

                <Box mb={3}>
                    <Filter
                        filter={filter}

                        onSearch={this.getContacts}
                        onChangeFilter={this.onChangeFilter}
                    />
                </Box>

                <Box>

                    <Table
                        rows={rows}
                        filter={filter}
                        pagination={pagination}
                        isLoading={isLoading}
                        totalCountRows={totalCountRows}

                        onChangeFilter={this.onChangeFilter}
                    />

                </Box>

            </>
        );
    }
}

export default Contacts
