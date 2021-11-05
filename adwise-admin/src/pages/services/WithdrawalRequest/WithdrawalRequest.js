import React, { Component } from "react";
import {
    Box,
    Grid,
    Button,
    Typography, Tooltip, CircularProgress, Backdrop,
} from "@material-ui/core";
import {
    Table,
    EditWithdrawalRequest,
    CreateWithdrawalRequest
} from "./components";
import {
    ConfirmationDialog
} from "../../../components";
import {Plus as PlusIcon} from "react-feather";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import queryString from "query-string";
import alertNotification from "../../../common/alertNotification";
import {getPageFromCount} from "../../../common/pagination";
import {formatMoney} from "../../../helper/format";
import currency from "../../../constants/currency";

class WithdrawalRequest extends Component {
    constructor(props) {
        super(props);

        const searchString = this.props.history.location.search;
        const searchParams = queryString.parse(searchString);

        this.state = {
            withdrawalRequests: [],

            filter: {
                sortBy: 'timestamp',
                order: -1,

                pageSize: 20,
                pageNumber: 1,

                name: '',
                _id: searchParams._id || '',
            },
            pagination: {
                countPages: 1
            },
            editWithdrawalRequest: {},
            confirmWithdrawalRequest: {},
            confirmWithdrawalRequestLegal: {},

            totalCountRows: 0,
            courseBnb: 0,
            courseUsd: 0,

            isLoading: true,
            isShowBackdrop: false,
            isOpenEditWithdrawalRequest: false,
            isOpenCreateWithdrawalRequest: false,
        };
    }

    componentDidMount = () => {
        this.wsCoinCup();
        this.getWithdrawalRequest();
    }

    wsCoinCup = () => {
        let webSocketNotification = new WebSocket('wss://coincap.wise.win/ws');
        webSocketNotification.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            if (data.event === 'current_currencies') {
                this.setState({
                    courseBnb: Number.parseFloat(data.data.find((t) => t.name === 'Binance Coin').price_usd)
                })
            }
            if (data.event === 'current_fiats') {
                this.setState({
                    courseUsd: Number.parseFloat(data.data.find((t) => t.code === 'RUB').price_usd)
                })
            }
        };
    }

    getWithdrawalRequest = () => {
        this.setState({ isLoading: true });

        const searchUrl = this.getFilter();

        axiosInstance.get(`${ apiUrls["find-withdrawal-requests"] }${ searchUrl }`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                withdrawalRequests: response.data.data.withdrawalRequests,
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
            if (!!filter[key]) {
                filters.push(`${ key }=${ filter[key] }`)
            }
            if (!filter[key]) {}
        });

        return `?${ filters.join('&') }`
    }

    onOpenModalCreateWithdrawalRequest = () => {
        this.setState({ isOpenCreateWithdrawalRequest: true });
    }

    makePayment = (withdrawalRequest, isConfirm) => {
        if (!isConfirm) {
            this.setState({ confirmWithdrawalRequest: withdrawalRequest })

            return null
        }

        this.setState({ confirmWithdrawalRequest: {}, isShowBackdrop: true });

        axiosInstance.put(`${ apiUrls["set-withdrawal-request-satisfied"] }/${ withdrawalRequest._id }`).then((response) => {
            this.setState({ isShowBackdrop: false });

            alertNotification({
                title: "Системной уведомлени",
                message: "Средства успешно выплачены",
                type: "success"
            });

            this.getWithdrawalRequest();
        }).catch((error) => {
            this.setState({ isShowBackdrop: false });

            alertNotification({
                title: "Системной уведомлени",
                message: "Ошибка вывода средств",
                type: "success"
            });
        });
    }
    makePaymentLegal = (withdrawalRequest, isConfirm) => {
        if (!isConfirm) {
            this.setState({ confirmWithdrawalRequestLegal: withdrawalRequest })

            return null
        }

        this.setState({ confirmWithdrawalRequestLegal: {}, isShowBackdrop: true });

        axiosInstance.put(`${ apiUrls["set-legal-withdrawal-request-satisfied"] }/${ withdrawalRequest._id }`).then((response) => {
            this.setState({ isShowBackdrop: false });

            alertNotification({
                title: "Системной уведомлени",
                message: "Средства успешно выплачены",
                type: "success"
            });

            this.getWithdrawalRequest();
        }).catch((error) => {
            this.setState({ isShowBackdrop: false });

            alertNotification({
                title: "Системной уведомлени",
                message: "Ошибка вывода средств",
                type: "success"
            });
        });
    }

    onCreateWithdrawalRequest = async (form, events) => {
        this.setState({ isShowBackdrop: true });

        let body = {...form};
        if (body.organizationId) {
            body.walletId = await axiosInstance.get(`${ apiUrls["get-organization"] }/${ body.organizationId }`).then((res) => {
                return res.data.data.organization?.wallet
            })
        }
        if (body.userId) {
            body.walletId = await axiosInstance.get(`${ apiUrls["get-user"] }/${ body.userId }`).then((res) => {
                return res.data.data.user?.wallet?._id
            })
        }

        axiosInstance.post(apiUrls["create-legal-withdrawal-request"], body).then((response) => {
            this.setState({
                isShowBackdrop: false,
                isOpenCreateWithdrawalRequest: false
            });

            this.getWithdrawalRequest();

            alertNotification({
               title: 'Системной уведомление',
               message: 'Заявка успешно создана',
               type: 'success'
            });
        }).catch((error) => {
            error = error.response.data.error;

            let message = '';

            switch (error.message) {
                case "Not enough points in wallet": {
                    message =  "Не хватает средств для вывода";

                    break
                }

                default: {
                    return error.message
                }
            }

            this.setState({ isShowBackdrop: false });



            alertNotification({
                title: 'Системной уведомление',
                message: message,
                type: 'danger'
            });
        });
    }

    onChangeFilter = (filter, isFastStart = false) => {
        this.setState({ filter }, () => {
            if (isFastStart) {
                this.getWithdrawalRequest();
            }
        });
    }

    onEdit = (row, isPermission) => {
        if (!isPermission) {
            this.setState({
                editWithdrawalRequest: row,
                isOpenEditWithdrawalRequest: true
            })

            return null
        }

        this.setState({ isShowBackdrop: true });

        axiosInstance.put(`${ apiUrls["update-withdrawal-request"] }/${this.state.editWithdrawalRequest._id}`, row).then((res) => {
            this.setState({ isShowBackdrop: false, isOpenEditWithdrawalRequest: false });

            alertNotification({
                message: "Запрос на вывод успешно изменен",
                type: "success"
            })

            this.getWithdrawalRequest();
        }).catch((error) => {
            alertNotification({
                message: "Произошла ошибки",
                type: "danger"
            })

            this.setState({ isShowBackdrop: false });
        })
    }

    _getTitleConfirmationDialogMenagerOrganization = (confirmWithdrawalRequestLegal) => {
        if (confirmWithdrawalRequestLegal?.user?.wisewinId) {
            return `Вы действительно хотите выплатить менеджеру ${confirmWithdrawalRequestLegal?.user?.lastName} ${confirmWithdrawalRequestLegal?.user?.firstName} сумму в размере ${formatMoney(confirmWithdrawalRequestLegal?.sum)}${currency.rub}`;
        }

        return `Вы действительно хотите выплатить организации ${confirmWithdrawalRequestLegal?.organization?.name} сумму в размере ${formatMoney(confirmWithdrawalRequestLegal?.sum)}${currency.rub}`
    }

    render() {
        const { courseUsd, courseBnb, confirmWithdrawalRequest, confirmWithdrawalRequestLegal, withdrawalRequests, pagination, filter, editWithdrawalRequest, isLoading, isOpenEditWithdrawalRequest } = this.state;

        return (
            <>

                <Box mb={4}>
                    <Grid container spacing={2} justify="space-between">

                        <Grid item>
                            <Typography variant="h1">Запросы на вывод</Typography>
                        </Grid>

                        <Grid item>
                            <Tooltip title="Создать запрос на вывод">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    style={{padding: 10, minWidth: 0}}

                                    onClick={this.onOpenModalCreateWithdrawalRequest}
                                >
                                    <PlusIcon/>
                                </Button>
                            </Tooltip>
                        </Grid>

                    </Grid>
                </Box>

                <Box>
                    <Table
                        rows={withdrawalRequests}
                        filter={filter}
                        pagination={pagination}
                        totalCountRows={this.state.totalCountRows}


                        isLoading={isLoading}

                        onDelete={this.onDeleteTask}
                        makePayment={this.makePayment}
                        makePaymentLegal={this.makePaymentLegal}
                        onChangeActiveTask={this.onChangeActiveTask}
                        onChangeFilter={this.onChangeFilter}
                        onEdit={this.onEdit}
                    />
                </Box>

                <CreateWithdrawalRequest
                    isOpen={this.state.isOpenCreateWithdrawalRequest}

                    onSubmit={this.onCreateWithdrawalRequest}
                    onClose={() => this.setState({ isOpenCreateWithdrawalRequest: false })}
                />

                <EditWithdrawalRequest
                    isOpen={isOpenEditWithdrawalRequest}
                    initialForm={editWithdrawalRequest}

                    onSubmit={(form) => this.onEdit(form, true)}
                    onClose={() => this.setState({isOpenEditWithdrawalRequest: false})}
                />

                <ConfirmationDialog
                    title="Подтверждение на вывод средств"
                    titleButton="Да, выплатить"
                    message={`Вы действительно хотите выплатить ${confirmWithdrawalRequest?.user?.lastName} ${confirmWithdrawalRequest?.user?.firstName} сумму в размере ${formatMoney(confirmWithdrawalRequest?.sum)}${currency.rub} (${(courseUsd * confirmWithdrawalRequest?.sum) / courseBnb}BNB) за выполнение задачи ${confirmWithdrawalRequest?.task?.name}`}
                    isOpen={Boolean(Object.keys(confirmWithdrawalRequest).length > 0)}

                    onConfirm={() => this.makePayment(confirmWithdrawalRequest, true)}
                    onClose={() => this.setState({confirmWithdrawalRequest: {}})}
                />

                <ConfirmationDialog
                    title="Подтверждение на вывод средств"
                    titleButton="Да, выплатить"
                    message={this._getTitleConfirmationDialogMenagerOrganization(confirmWithdrawalRequestLegal)}
                    isOpen={Boolean(Object.keys(confirmWithdrawalRequestLegal).length > 0)}

                    onConfirm={() => this.makePaymentLegal(confirmWithdrawalRequestLegal, true)}
                    onClose={() => this.setState({confirmWithdrawalRequestLegal: {}})}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default WithdrawalRequest
