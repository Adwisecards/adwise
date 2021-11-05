import React, { Component } from "react";
import {
    Backdrop,
    Box, Button, CircularProgress,
    Grid, Tooltip,
    Typography
} from "@material-ui/core";
import {
    Table,
    Filter,
    DialogReferralChange
} from "./components";
import {store} from "react-notifications-component";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import queryString from "query-string";
import {getPageFromCount} from "../../../common/pagination";
import {UserX as UserXIcon} from "react-feather";
import alertNotification from "../../../common/alertNotification";
import moment from "moment";

class UserSubscriptions extends Component {
    constructor(props) {
        super(props);

        const searchString = this.props.history.location.search;
        const searchParams = queryString.parse(searchString);

        this.state = {

            findSubscriptionCreatedRecords: [],

            filter: {
                sortBy: 'timestamp',
                order: -1,

                'organization._id': "",
                dateFrom: '',
                dateTo: '',

                pageSize: searchParams.pageSize || 20,
                pageNumber: 1
            },
            pagination: {
                countPages: 1
            },

            totalCountRows: 0,

            isLoading: true,
            isShowBackdrop: false,
            isOpenDialogReferralChange: false
        };
    }

    componentDidMount = () => {
        this.getFindSubscriptionCreatedRecords();
    }

    getFindSubscriptionCreatedRecords = () => {
        this.setState({ isLoading: true })

        const filterSearch = this.getFilter();

        axiosInstance.get(`${ apiUrls["find-subscription-created-records"] }${ filterSearch }`).then((response) => {

            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                pagination,
                isLoading: false,
                totalCountRows: response.data.data.count,
                findSubscriptionCreatedRecords: response.data.data.subscriptionCreatedRecords
            })
        });
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
            if (!!filter[key] &&
                (key === 'dateFrom' ||
                    key === 'dateTo')
            ) {
                filters.push(`${key}=${moment(filter[key]).format('YYYY-MM-DD')}`)
            }
        });

        return `?${ filters.join('&') }`
    }

    onChangeFilter = (filter, isFastStart = false) => {
        this.setState({ filter }, () => {
            if (isFastStart) {
                this.getFindSubscriptionCreatedRecords();
            }
        });
    }

    onOpenDialogReferralChange = () => {
        this.setState({ isOpenDialogReferralChange: true })
    }
    onChangeParent = (props) => {
        const { parent, reason, subscription, userReferral } = props;
        console.log('props: ', props);

        this.setState({ isShowBackdrop: true });
        axiosInstance.put(`${ apiUrls["change-subscription-parent"] }${ subscription._id }`, {
            parentId: userReferral?._id,
            reason
        }).then((response) => {
            alertNotification({
                title: 'Системное уведомление',
                message: 'Пользователь успешно изменил родителя подписки',
                type: 'success'
            });

            this.setState({
                isShowBackdrop: false,
                isOpenDialogReferralChange: false
            });
            this.getFindSubscriptionCreatedRecords();
        }).catch(() => {
            alertNotification({
                title: 'Системное уведомление',
                message: 'Произошла ошибка при изменении подписки пользователя',
                type: 'danger'
            });
            this.setState({ isShowBackdrop: false })
        })

    }

    render() {
        const {
            findSubscriptionCreatedRecords, filter, totalCountRows, pagination, isLoading,
            isOpenDialogReferralChange
        } = this.state;

        return (
            <>

                <Box mb={4}>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="h1">Пользовательские подписки</Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Создать запрос на смену реферала">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    style={{padding: 10, minWidth: 0}}

                                    onClick={this.onOpenDialogReferralChange}
                                >
                                    <UserXIcon color="#8152E4"/>
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={5}>
                    <Filter
                        filter={filter}

                        onChange={this.onChangeFilter}
                        onSearch={this.getFindSubscriptionCreatedRecords}
                    />
                </Box>

                <Box>
                    <Table
                        rows={findSubscriptionCreatedRecords}
                        filter={filter}
                        totalCountRows={totalCountRows}
                        pagination={pagination}

                        isLoading={isLoading}

                        onChangeFilter={this.onChangeFilter}
                    />
                </Box>

                <DialogReferralChange
                    isOpen={isOpenDialogReferralChange}

                    onClose={() => this.setState({ isOpenDialogReferralChange: false })}
                    onChangeParent={this.onChangeParent}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default UserSubscriptions
