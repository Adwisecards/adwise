import React, {Component} from 'react';
import {
    Box,
    Grid,
    Button,
    Typography,

    Tabs,
    Tab, Link
} from "@material-ui/core";
import {
    Pagination
} from "@material-ui/lab";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import {formatMoney} from "../../../helper/format";
import currency from "../../../constants/currency";
import moment from "moment";
import {getPageFromCount} from "../../../common/pagination";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class Notifications extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: [],

            filter: {
                page: 1,
                limit: 20
            },
            pagination: {
                page: 0
            },

            tab: "unread",

            isLoading: true
        }
    }

    componentDidMount = () => {
        this.props.setCountNotification(0);

        this.getNotification();
    }

    getNotification = () => {
        const { organization } = this.props;

        axiosInstance.get(`${urls["get-organization-notifications"]}/${organization._id}?page=${this.state.filter.page}&limit=${this.state.filter.limit}&seen=${(this.state.tab === 'unread') ? '0' : '1'}`).then((res) => {
            let pagination = {...this.state.pagination};
            pagination.page = getPageFromCount(res.data.data.count, this.state.filter.limit);

            this.setState({
                notifications: res.data.data.organizationNotifications,
                pagination
            })
        })
    }

    onChangeType = (event, tab) => {
        let filter = {...this.state.filter};
        filter.page = 1;

        this.setState({tab, filter}, () => {
            this.getNotification();
        });
    }

    onChangePagination = (event, page) => {
        let filter = {...this.state.filter};
        filter.page = page;

        this.setState({
            filter
        }, () => {
            this.getNotification();
        })
    }

    render() {
        const { tab, filter, pagination, notifications, isLoading } = this.state;

        return (
            <>

                <Box mb={3}>
                    <Typography variant="h1">{allTranslations(localization['notification.title'])}</Typography>
                </Box>

                <Box mb={4}>
                    <Tabs value={tab} onChange={this.onChangeType}>
                        <Tab value="unread" label={allTranslations(localization['notification.unread'])}/>
                        <Tab value="read" label={allTranslations(localization['notification.read'])}/>
                    </Tabs>
                </Box>

                <Box maxWidth={800}>

                    {
                        Boolean(pagination.page > 0) && (
                            <Box mb={2}>
                                <Pagination
                                    page={filter.page}
                                    count={pagination.page}
                                    onChange={this.onChangePagination}
                                />
                            </Box>
                        )
                    }
                    {
                        notifications.map((notification, idx) => {
                            if (notification.type === "couponExpired"){
                                return (
                                    <CardСouponExpired key={`notification-${idx}`} {...notification}/>
                                )
                            }
                            if (notification.type === "legalInfoRequestRejected"){
                                return (
                                    <CardLegalInfoRequestRejected key={`notification-${idx}`} {...notification}/>
                                )
                            }
                            if (notification.type === "legalInfoRequestSatisfied"){
                                return (
                                    <CardLegalInfoRequestSatisfied key={`notification-${idx}`} {...notification}/>
                                )
                            }
                            return (
                                <CardPurchaseConfirmed key={`notification-${idx}`} {...notification}/>
                            )
                        })
                    }
                </Box>

            </>
        );
    }
}

const CardPurchaseConfirmed = (notification) => {
    return (
        <Box
            mb={2}
            p={2}
            bgcolor="#FFFFFF"
            boxShadow="0px 2px 4px rgba(0, 0, 0, 0.15)"
            borderRadius={10}
        >
            <Box mb={1}>
                <Grid container spacing={1} alignItems="flex-end">
                    <Grid item><Typography color="primary" variant="h4">{allTranslations(localization['notification.purchasePayment'])}</Typography></Grid>
                    <Grid item><Link target="_blank" href={`/bills`}>{allTranslations(localization['notification.buttonGo'])}</Link></Grid>
                </Grid>
            </Box>

            <Box>
                <Grid container spacing={1}>
                    <Grid item><Typography variant="subtitle1">{allTranslations(localization['notification.coupons'])} </Typography></Grid>
                    {
                        (notification?.purchase?.coupons || []).map((coupon, idx) => (
                            <Grid item><Link target="_blank" href={`/coupons/${coupon._id}`}>{coupon.name}</Link></Grid>
                        ))
                    }
                </Grid>
                <Typography variant="subtitle1">{allTranslations(localization['notification.purchaseAmount'])} - {formatMoney(notification?.purchase?.sumInPoints)} {currency.rub}</Typography>
                <Typography variant="subtitle1">{allTranslations(localization['notification.usePoints'])} - {formatMoney(notification?.purchase?.usedPoints)} {currency.rub}</Typography>
            </Box>
        </Box>
    )
}
const CardСouponExpired = (notification) => {
    return (
        <Box
            mb={2}
            p={2}
            bgcolor="#FFFFFF"
            boxShadow="0px 2px 4px rgba(0, 0, 0, 0.15)"
            borderRadius={10}
        >
            <Box mb={1}>
                <Grid container spacing={1} alignItems="flex-end">
                    <Grid item><Typography color="primary" variant="h4">{allTranslations(localization['notification.couponExpired'])}</Typography></Grid>
                </Grid>
            </Box>

            <Box>
                <Grid container spacing={1}>
                    <Grid item xs={12}><Typography variant="subtitle1">{notification.coupon.name}</Typography></Grid>
                    <Grid item xs={12}><Typography variant="subtitle1"> {moment(notification.coupon.endDate).format("DD.MM.YYYY HH:mm")}</Typography></Grid>
                </Grid>
            </Box>
        </Box>
    )
}
const CardLegalInfoRequestRejected = (notification) => {
    return (
        <Box
            mb={2}
            p={2}
            bgcolor="#FFFFFF"
            boxShadow="0px 2px 4px rgba(0, 0, 0, 0.15)"
            borderRadius={10}
        >
            <Box mb={1}>
                <Grid container spacing={1} alignItems="flex-end">
                    <Grid item><Typography color="primary" variant="h4">{allTranslations(localization['notification.requestChangeFormDetails'])}</Typography></Grid>
                </Grid>
            </Box>

            <Box>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">{allTranslations(localization['notification.requestChangeFormDetailsTitle'])}: {notification?.legalInfoRequest?.satisfied ? allTranslations(localization['notification.requestChangeFormDetailsApproved']) : allTranslations(allTranslations(localization['notification.requestChangeFormDetailsRejected']))}</Typography>
                    </Grid>
                    {
                        Boolean(notification?.legalInfoRequest?.rejected) && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">{allTranslations(localization['notification.requestChangeFormDetailsRejectedMessage'])}: {notification?.legalInfoRequest?.rejectionReason}</Typography>
                            </Grid>
                        )
                    }
                </Grid>
            </Box>
        </Box>
    )
}
const CardLegalInfoRequestSatisfied = (notification) => {
    return (
        <Box
            mb={2}
            p={2}
            bgcolor="#FFFFFF"
            boxShadow="0px 2px 4px rgba(0, 0, 0, 0.15)"
            borderRadius={10}
        >
            <Box mb={1}>
                <Grid container spacing={1} alignItems="flex-end">
                    <Grid item><Typography color="primary" variant="h4">{allTranslations(localization['notification.requestChangeFormDetails'])}</Typography></Grid>
                </Grid>
            </Box>

            <Box>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">{allTranslations(localization['notification.requestChangeFormDetailsRejectedMessage'])}: {allTranslations(localization['notification.requestChangeFormDetailsApproved'])}</Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default Notifications
