import React, {Component} from "react";
import {
    Box,
    Grid,
    Button,
    Typography, Tooltip, CircularProgress, Backdrop, Paper, Collapse,
} from "@material-ui/core";
import {
    Table,
    Filter,
    Information
} from "./components";
import queryString from "query-string";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import moment from "moment";
import {
    FileText as FileTextIcon
} from "react-feather";
import {ExcelIcon} from "../../../icons";
import {getPageFromCount} from "../../../common/pagination";
import {ConfirmationDialog} from "../../../components";
import alertNotification from "../../../common/alertNotification";

class Purchases extends Component {
    constructor(props) {
        super(props);

        const searchString = this.props.history.location.search;
        const searchParams = queryString.parse(searchString);

        this.state = {
            purchases: [],

            filter: {
                sortBy: 'timestamp',
                order: -1,

                pageSize: searchParams.pageSize || 20,
                pageNumber: 1,

                _id: searchParams._id || '',
                'organization._id': searchParams.organization || '',
                description: searchParams.description || '',
                dateFrom: searchParams.dateFrom || null,
                dateTo: searchParams.dateTo || null,
                type: searchParams.type || null,
                'purchaser._id': searchParams.purchaser || null,
                'user._id': searchParams.user || '',
                'coupons._id': searchParams.coupon || '',
                'ref.code': searchParams.ref_code || '',
                total: 0,

                confirmed: '',
                complete: '',
                processing: '',
                canceled: '',

                'payment.cash': '',
                'payment.safe': '',
                'payment.split': '',
            },
            pagination: {
                countPages: 1
            },
            stats: {},
            canceledPurchase: {},

            totalCountRows: 0,

            isLoading: true,
            isShowBackdrop: false,
            isOpenConfirmationDialog: false,
            isOpenConfirmationUpdateStatusDialog: false
        };
    }

    componentDidMount = () => {
        this.props.history.replace('/purchases');

        this.getListPurchases();
    }

    getListPurchases = () => {
        this.setState({isLoading: true});

        const searchUrl = this.getFilter();

        axiosInstance(`${apiUrls["find-purchases"]}${searchUrl}`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                purchases: response.data.data.purchases,
                isLoading: false,
                totalCountRows: response.data.data.count,
                pagination
            })
        });
    }
    getFilter = (isActiveTotal = false) => {
        const filter = {...this.state.filter};
        let filters = [];

        Object.keys(filter).map((key) => {
            if (
                !!filter[key] &&
                key !== 'complete' &&
                key !== 'canceled' &&
                key !== 'confirmed' &&
                key !== 'processing' &&
                key !== 'dateFrom' &&
                key !== 'total' &&
                key !== 'payment.cash' &&
                key !== 'payment.safe' &&
                key !== 'payment.split' &&
                key !== 'dateTo'
            ) {
                filters.push(`${key}=${filter[key]}`)
            }

            if (key === 'complete' && filter[key] !== '') {
                filters.push(`${key}=${filter[key]}`)
            }
            if (key === 'canceled' && filter[key] !== '') {
                filters.push(`${key}=${filter[key]}`)
            }
            if (key === 'confirmed' && filter[key] !== '') {
                filters.push(`${key}=${filter[key]}`)
            }
            if (key === 'processing' && filter[key] !== '') {
                filters.push(`${key}=${filter[key]}`)
            }
            if (key === 'payment.cash' && filter[key] !== '') {
                filters.push(`${key}=${filter[key]}`)
            }
            if (key === 'payment.safe' && filter[key] !== '') {
                filters.push(`${key}=${filter[key]}`)
            }
            if (key === 'payment.split' && filter[key] !== '') {
                filters.push(`${key}=${filter[key]}`)
            }

            if (key === 'dateFrom' || key === 'dateTo') {
                if (!!filter[key]) {
                    filters.push(`${key}=${moment(filter[key]).format('YYYY-MM-DD')}`)
                }
            }

            if (key === 'total' && isActiveTotal) {
                filters.push(`${key}=${filter[key]}`)
            }
        });

        return `?${filters.join('&')}`
    }

    onChangeFilter = (filter, isFastStart = false) => {
        this.setState({filter}, () => {
            if (isFastStart) {
                this.getListPurchases();
            }
        });
    }

    onExportPurchases = () => {
        this.setState({ isShowBackdrop: true });

        const filterSearch = this.getFilter();

        axiosInstance.get(`${ apiUrls["find-purchases"] }${ filterSearch }&export=1`, {
                method: 'GET',
                responseType: 'blob'
            }
        ).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'purchases.xlsx');
            document.body.appendChild(link);
            link.click();

            this.setState({ isShowBackdrop: false });
        }).catch(() => {
            this.setState({ isShowBackdrop: false });
        })
    }

    onLoadStatsPurchase = () => {
        let filter = {...this.state.filter};

        filter.total = (filter.total === 1) ? 0 : 1;

        this.setState({
            filter,
            stats: {}
        }, () => {

            if (filter.total) {
                const searchUrl = this.getFilter(true);
                axiosInstance(`${apiUrls["find-purchases"]}${searchUrl}`).then((response) => {
                    this.setState({
                        stats: response.data.data.stats
                    })
                });
            }

        })
    }

    onCancelPurchase = (row, confirm) => {
        if (!confirm) {
            this.setState({
                isOpenConfirmationDialog: true,
                canceledPurchase: row
            })

            return null
        }

        this.setState({
            isShowBackdrop: true,
            isOpenConfirmationDialog: false
        })

        axiosInstance.put(`${ apiUrls["purchase-cancel-purchase"] }/${ row._id }`).then((response) => {
            this.setState({isShowBackdrop: false})

            this.getListPurchases();
        })
    }

    onUpdateStatusPurchase = (row, confirm) => {
        if (!confirm) {
            this.setState({
                isOpenConfirmationUpdateStatusDialog: true,
                statusUpdatePurchase: row
            })

            return null
        }

        this.setState({
            isOpenConfirmationUpdateStatusDialog: false,
            isShowBackdrop: true
        })

        axiosInstance.put(`${ apiUrls["finance-set-purchase-paid"] }/${ row._id }`, {}).then(() => {
            this.getListPurchases();

            this.setState({ isShowBackdrop: false });

            alertNotification({
                title: "Системное уведомление",
                message: "Статус покупки изменени",
                type: "success"
            })
        })
    }

    render() {
        const {
            purchases, pagination, filter, stats, isLoading,
            isOpenConfirmationDialog, canceledPurchase,
            isOpenConfirmationUpdateStatusDialog,
            statusUpdatePurchase
        } = this.state;

        return (
            <>
                <Box mb={4}>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Typography variant="h1">Покупки</Typography>
                        </Grid>
                        <Grid item>

                            <Grid item>
                                    <Tooltip title="Выгрузить XLS">
                                        <Button onClick={this.onExportPurchases}>

                                            <ExcelIcon/>

                                        </Button>
                                    </Tooltip>
                                </Grid>

                        </Grid>
                    </Grid>
                </Box>

                <Box mb={3}>
                    <Filter
                        filter={filter}

                        onSearch={this.getListPurchases}
                        onChange={this.onChangeFilter}
                    />
                </Box>

                <Box mb={2}>

                    <Box mb={1}>
                        <Tooltip title={filter.total === 0 ? "Отобразить статистику покупок" : "Скрыть статистику покупок" }>
                            <Button onClick={this.onLoadStatsPurchase} variant="contained" size="small">

                                <FileTextIcon width={16} style={{ marginRight: 8 }}/>

                                {filter.total === 0 ? "Загрузить статистику покупок" : "Скрыть статистику покупок" }

                            </Button>
                        </Tooltip>
                    </Box>

                    <Collapse in={filter.total} style={{ marginTop: 24 }}>
                        <Paper elevation={0}>

                            <Information
                                stats={stats}
                                filter={filter}
                            />

                        </Paper>
                    </Collapse>
                </Box>

                <Box>
                    <Table
                        rows={purchases}
                        filter={filter}
                        pagination={pagination}
                        totalCountRows={this.state.totalCountRows}

                        isLoading={isLoading}

                        onChangeFilter={this.onChangeFilter}
                        onCancelPurchase={this.onCancelPurchase}
                        onUpdateStatusPurchase={this.onUpdateStatusPurchase}
                    />
                </Box>

                <ConfirmationDialog
                    isOpen={isOpenConfirmationDialog}
                    message={`Вы действительно хотите вернуть покупку ${ canceledPurchase?.coupons?.[0]?.name }?`}
                    titleButton="Да, вернуть"

                    onClose={() => this.setState({ isOpenConfirmationDialog: false })}
                    onConfirm={() => this.onCancelPurchase(canceledPurchase, true)}
                />

                <ConfirmationDialog
                    isOpen={isOpenConfirmationUpdateStatusDialog}
                    message={`Вы действительно хотите обновить статус покупки покупку ${ statusUpdatePurchase?.coupons?.[0]?.name }?`}
                    titleButton="Да, обновить"

                    onClose={() => this.setState({ isOpenConfirmationUpdateStatusDialog: false })}
                    onConfirm={() => this.onUpdateStatusPurchase(statusUpdatePurchase, true)}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default Purchases
