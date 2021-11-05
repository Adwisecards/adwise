import React, {Component} from 'react'
import {
    Box,
    Grid,
    Badge,
    Button,
    Chip,
    Tooltip,
    IconButton,
    Typography,
    Backdrop,
    CircularProgress
} from "@material-ui/core";
import {withStyles} from '@material-ui/styles';
import {
    Table,
    Filter,
    Statistics
} from "./components";
import {
    Download as DownloadIcon
} from "react-feather";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import {getPageFromCount} from "../../../common/pagination";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import parseSearchUrl from "../../../common/url";

const initialFilter = {
    page: 1,
    limit: 20,

    fullName: "",

    order: -1,
    sortBy: 'user',
};

class OrganizationClients extends Component {

    constructor(props) {
        super(props);

        const filter = parseSearchUrl(this.props.history.location.search, initialFilter);

        this.state = {
            clients: [],

            filter: filter,
            pagination: {
                countPages: 1
            },
            statistics: {
                clientCount: 0,
                purchaseSum: 0,
                purchaserCount: 0
            },

            totalClients: 0,

            isLoading: true,
            isShowBackdrop: false
        }
    }

    componentDidMount = () => {
        this.getClients();
        this.getStatistics();
    }

    getClients = () => {
        const organizationId = this.props.app.organization._id;

        this.setState({
            isLoading: true
        })

        const searchUrl = this.getFilter();

        window.history.replaceState(null,null, `/clients${searchUrl}`);
        axiosInstance.get(`${urls["get-clients"]}${organizationId}${searchUrl}`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.limit);

            this.setState({
                pagination,
                totalClients: response.data.data.count,
                clients: response.data.data.clients,
                isLoading: false
            })
        });
    }
    getFilter = () => {
        const filter = {...this.state.filter};
        let string = [];

        Object.keys(filter).map((key) => {
            const value = filter[key];

            if (filter) {
                string.push(`${key}=${value}`)
            }
        })


        return `?${string.join('&')}`
    }

    getStatistics = () => {
        const organizationId = this.props.app.organization._id;

        axiosInstance.get(`${ urls['get-client-statistics'] }${ organizationId }?limit=999&page=1`).then((response) => {
            this.setState({
                statistics: response.data.data
            })
        });
    }

    onExportClients = async () => {
        this.setState({isShowBackdrop: true});

        const organizationId = this.props.app.organization._id;
        const searchUrl = this.getFilter();
        const url = `${urls["get-clients"]}${organizationId}${searchUrl}&export=1`;

        await axiosInstance.get(url, {
            method: 'GET',
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'clients.xlsx');
            document.body.appendChild(link);
            link.click();
        })

        this.setState({isShowBackdrop: false});
    }

    onChangeFilter = (filter = this.state.filter, isFastStart = false) => {
        this.setState({
            filter
        }, () => {
            if (isFastStart) {
                this.getClients()
            }
        })
    }

    render() {
        const {clients, filter, pagination, statistics, totalClients, isLoading} = this.state;

        return (
            <>

                <Box mb={2}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <Typography variant="h1">{ allTranslations(localization.clientsTitle) }</Typography>
                        </Grid>
                        <Grid item>
                            <Chip
                                label={totalClients}
                                color="primary"
                                style={{marginTop: -16}}
                            />
                        </Grid>

                        <Grid item style={{ marginLeft: 'auto' }}>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item>
                                    <Typography variant="body2">{allTranslations(localization.commonExport)}</Typography>
                                </Grid>
                                <Grid item>
                                    <Tooltip arrow title={allTranslations(localization.clientsExport)}>
                                        <IconButton onClick={this.onExportClients}>
                                            <DownloadIcon color="#8152E4"/>
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={2}>
                    <Filter
                        filter={filter}

                        onChange={this.onChangeFilter}
                        onSearch={this.getClients}
                    />
                </Box>

                <Box>
                    <Grid container spacing={3}>
                        <Grid item xs={8}>
                            <Table
                                rows={clients}
                                filter={filter}
                                pagination={pagination}
                                isLoading={isLoading}

                                onChangeFilter={this.onChangeFilter}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Statistics
                                statistics={statistics}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        )
    }
}

const styles = {};

export default withStyles(styles)(OrganizationClients)
