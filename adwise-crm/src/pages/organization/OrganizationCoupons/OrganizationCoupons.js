import React, {Component} from 'react';
import {
    Box,
    Grid,
    Button,
    Typography,
    CircularProgress,
    Backdrop,
    Tabs,
    Tab
} from '@material-ui/core';
import {
    withStyles
} from '@material-ui/styles';
import {
    Table,
    Filter,
    NoCoupons
} from './components';
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import {store} from "react-notifications-component";
import {StagesDocumentVerification} from "../../../components";
import {getPageFromCount} from "../../../common/pagination";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import alertNotification from "../../../common/alertNotification";
import parseSearchUrl from "../../../common/url";

const initialFilter = {
    page: 1,
    limit: 20,
    all: 1,

    disabled: '',
    type: '',
};

class OrganizationCoupons extends Component {
    constructor(props) {
        super(props);

        const filter = parseSearchUrl(this.props.history.location.search, initialFilter);

        this.state = {
            sharesList: [],

            filter: filter,
            pagination: {
                countPages: 1
            },

            page: 'all',
            type: 'all',
            tab: '',

            isLoadSharesList: true,
            isShowBackdrop: false
        }

        this.organizationId = this.props.organization._id;
        this.showNoCoupons = this.props.organization.coupons.length <= 0;
    }

    componentDidMount = () => {
        this.onGetListShares();
    }

    onGetListShares = () => {
        this.setState({
            isLoadSharesList: true,
            sharesList: []
        });

        const urlSearch = this.getFilter();

        window.history.replaceState(null,null, `/coupons${urlSearch}`);
        const url = `${urls["get-coupons"]}${this.organizationId}${urlSearch}`;

        axiosInstance.get(url).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.limit);
            const sharesList = response.data.data.coupons;

            this.setState({
                sharesList: sharesList,
                pagination: pagination,

                isLoadSharesList: false
            })
        })
    }
    getFilter = () => {
        const filter = {...this.state.filter};
        let filters = [];

        if (filter.disabled !== '') {
            filter.all = 0
        }

        Object.keys(filter).map((key) => {
            if (
                !!filter[key] &&
                key !== 'disabled' &&
                key !== 'type'
            ) {
                filters.push(`${key}=${filter[key]}`)
            }

            if (key === 'disabled' && filter[key] !== '') {
                filters.push(`${key}=${filter[key]}`);
            }
            if (key === 'type' && filter[key] !== '') {
                filters.push(`${key}=${filter[key]}`);
            }
        });

        return `?${filters.join('&')}`
    }

    onChangeSharesList = (sharesList) => {
        this.setState({sharesList})
    }

    onSetSortedIndex = () => {
        this.setState({isShowBackdrop: true});

        let data = {};
        const sharesList = [...this.state.sharesList];

        sharesList.map((item) => {
            data[item._id] = Number(item.index) || 1;
        });

        const body = {
            coupons: data
        }

        axiosInstance.put(urls["set-coupon-indeces"], body).then((response) => {
            this.onGetListShares();

            alertNotification({
                title: allTranslations(localization.notificationSystemNotification),
                message: allTranslations(localization.couponsOrderSuccessfullyChanged),
                type: 'success',
            })

            this.setState({isShowBackdrop: false});
        }).catch((error) => {
            this.setState({isShowBackdrop: false});

            alertNotification({
                title: allTranslations(localization.notificationSystemNotification),
                message: allTranslations(localization.couponsOrderErrorChanged),
                type: 'danger',
            })
        });
    }

    onChangeFilter = (filter = {}, isFastStart = true) => {
        this.setState({filter}, () => {
            this.onGetListShares();
        });
    }

    onCreateBasisCoupon = (coupon) => {
        this.props.history.push(`/shares/create?base=${ coupon._id }`);
    }

    onChangeTabs = (event, tab) => {
        let filter = {...this.state.filter};

        if (tab === ''){
            filter.disabled = ""
            filter.type = ""
        }
        if (tab === 'filter-disabled-0'){
            filter.disabled = "0"
            filter.type = ""
        }
        if (tab === 'filter-disabled-1'){
            filter.disabled = "1"
            filter.type = ""
        }
        if (tab === 'filter-type-service'){
            filter.type = "service"
            filter.disabled = ""
        }
        if (tab === 'filter-type-product'){
            filter.type = "product"
            filter.disabled = ""
        }

        this.setState({ filter, tab }, () => {
            this.onGetListShares();
        })
    }

    render() {
        const {classes} = this.props;
        const { pagination } = this.state;

        if (this.showNoCoupons) {
            return (
                <Box className={classes.root}>
                    <Box mb={2}>
                        <Typography variant="h1">{allTranslations(localization.couponsTitle)}</Typography>
                    </Box>

                    <Box mb={6}>
                        <StagesDocumentVerification/>
                    </Box>

                    <Box>
                        <NoCoupons/>
                    </Box>
                </Box>
            )
        }

        return (
            <Box className={classes.root}>
                <Box mb={2}>
                    <Typography variant="h1">{allTranslations(localization.couponsTitle)}</Typography>
                </Box>

                <Box mb={4}>
                    <StagesDocumentVerification/>
                </Box>

                <Box mb={4}>
                    <Grid container spacing={3} justify="space-between">
                        <Grid item>
                            <Grid container spacing={0}>
                                <Tabs value={this.state.tab} onChange={this.onChangeTabs}>
                                    <Tab value="" label={allTranslations(localization.couponsTabsAll)}/>
                                    <Tab value="filter-disabled-0"  label={allTranslations(localization.couponsTabsActive)}/>
                                    <Tab value="filter-disabled-1" label={allTranslations(localization.couponsTabsDisabled)}/>
                                    <Tab value="filter-type-service" label={allTranslations(localization.couponsTabsService)}/>
                                    <Tab value="filter-type-product" label={allTranslations(localization.couponsTabsProducts)}/>
                                </Tabs>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" size="small" onClick={this.onSetSortedIndex}>{allTranslations(localization.couponsChangeSortOrder)}</Button>
                        </Grid>
                    </Grid>
                </Box>

                <Box>
                    <Table
                        sharesList={this.state.sharesList}
                        activeTab={this.state.page}
                        type={this.state.type}
                        filter={this.state.filter}
                        pagination={this.state.pagination}
                        isLoadSharesList={this.state.isLoadSharesList}

                        onChangeFilter={this.onChangeFilter}
                        onChangeList={(sharesList) => this.setState({sharesList})}
                        onChangeSharesList={this.onChangeSharesList}
                        onCreateBasisCoupon={this.onCreateBasisCoupon}
                    />
                </Box>

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </Box>
        );
    }
}

const styles = {
    root: {
        paddingRight: 250
    }
};

export default withStyles(styles)(OrganizationCoupons)
