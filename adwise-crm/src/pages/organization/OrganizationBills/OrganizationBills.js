import React, {Component} from 'react';
import {
    Box,
    Grid,
    Typography
} from "@material-ui/core";
import {
    Table,
    Filter,
    DialogCoupons
} from "./components";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import {StagesDocumentVerification} from "../../../components";
import {getPageFromCount} from "../../../common/pagination";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import moment from "moment";
import parseSearchUrl from "../../../common/url";

const initialFilter = {
    page: 1,
    limit: 20,

    dateFrom: "",
    dateTo: "",
    purchaserContactId: "",
    cashierContactId: "",
    'types[]': "",
};

class OrganizationBills extends Component {
    constructor(props) {
        super(props);

        const filter = parseSearchUrl(this.props.history.location.search, initialFilter);

        this.state = {
            purchases: [],

            filter: filter,
            pagination: {
                countPages: 1
            },
            dialogCoupons: {
                isOpen: false
            },

            isLoading: true
        }
    }

    componentDidMount = () => {
        this.getListPurchases();
    }

    getListPurchases = () => {
        this.setState({isLoading: true});

        const searchUrl = this.getFilter();

        window.history.replaceState(null,null, `/bills${searchUrl}`);
        axiosInstance.get(`${urls["get-purchases"]}${this.props.organization._id}${searchUrl}`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.limit);

            this.setState({
                purchases: response.data.data.purchases,
                pagination: pagination,
                isLoading: false
            })
        });
    }
    getFilter = () => {
        const {filter} = this.state;
        let data = [];

        Object.keys(filter).map((key) => {
            const value = filter[key];

            if ( Boolean(!!value) && Boolean(key !== 'dateTo' && key !== 'dateFrom') ) {
                data.push(`${key}=${value}`)
            }

            if (
                !!value && Boolean(key === 'dateTo' || key === 'dateFrom')
            ) {
                data.push(`${key}=${moment(value).add(5, 'h').toISOString()}`)
            }

        });

        return `?${data.join('&')}`
    }

    onChangeFilter = (filter, isFastStart = false) => {
        this.setState({filter}, () => {
            if (isFastStart) {
                this.getListPurchases();
            }
        });
    }

    onOpenCoupons = (purchase) => {
        this.setState({
            dialogCoupons: {
                isOpen: true,
                purchase: purchase
            }
        })
    }

    render() {
        const {purchases, filter, pagination, isLoading, dialogCoupons} = this.state;

        return (
            <>

                <Box mb={4}>
                    <Typography variant="h1">{allTranslations(localization.billsTitle)}</Typography>
                </Box>

                <Box mb={4}>
                    <StagesDocumentVerification/>
                </Box>

                <Box mb={3}>
                    <Filter
                        filter={filter}
                        onChange={this.onChangeFilter}
                    />
                </Box>

                <Box>

                    <Table
                        rows={purchases}
                        filter={filter}
                        pagination={pagination}

                        isLoading={isLoading}

                        onChangeFilter={this.onChangeFilter}
                        onOpenCoupons={this.onOpenCoupons}
                    />

                </Box>

                <DialogCoupons
                    isOpen={dialogCoupons?.isOpen || false}
                    purchase={dialogCoupons?.purchase || {}}
                    onClose={() => this.setState({dialogCoupons: null})}
                />

            </>
        );
    }
}

export default OrganizationBills
