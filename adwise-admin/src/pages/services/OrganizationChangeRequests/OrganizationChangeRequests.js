import React, { Component } from "react";
import {
    Box,
    Grid,
    Typography,
    Button, CircularProgress, Backdrop
} from "@material-ui/core";
import {
    Table as TableComponent,
    Filter as FilterComponent,
    DialogRejectRequest as DialogRejectRequestComponent
} from "./components";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import {getPageFromCount} from "../../../common/pagination";
import moment from "moment";
import alertNotification from "../../../common/alertNotification";
import {getFormFromBody} from "../../../legalForms/helpers";

class OrganizationChangeRequests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [],

            filter: {
                sortBy: 'timestamp',
                order: -1,

                pageSize: 20,
                pageNumber: 1
            },
            pagination: {
                countPages: 1
            },

            dialogRejectRequest: "",

            totalCountRows: 0,

            isLoading: true,
            isShowBackdrop: false,
        };
    }

    componentDidMount = () => {
        this.getLegalInfoRequests();
    }

    getLegalInfoRequests = () => {
        this.setState({ isLoading: true });

        const searchUrl = this.getFilter();
        axiosInstance.get(`${apiUrls["find-legal-info-requests"]}${searchUrl}`).then((response) => {
            const legalInfoRequests = (response.data.data.legalInfoRequests || []).map((item) => {

                return {
                    ...item,
                    legal: {
                        ...item.legal,
                        info: getFormFromBody(item.legal)
                    },
                }

            });
            // const legalInfoRequests = getFormFromBody()
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                rows: legalInfoRequests,
                totalCountRows: response.data.data.count,
                isLoading: false,
                pagination
            })
        });
    }
    getFilter = () => {
        const filter = {...this.state.filter};
        let filters = [];

        Object.keys(filter).map((key) => {
            if (!!filter[key]) {
                filters.push(`${key}=${filter[key]}`)
            }
            if (!filter[key]) {
            }
        });

        return `?${filters.join('&')}`
    }

    onChangeFilter = (filter, isFastStart) => {
        this.setState({filter}, () => {
            if (isFastStart) {
                this.getListTransactions();
            }
        })
    }

    onAllowChange = (id) => {
        this.setState({isShowBackdrop: true});

        axiosInstance.put(`${apiUrls['satisfy-legal-info-request']}/${id}`).then((res) => {
            this.getLegalInfoRequests();

            alertNotification({
                title: "Системное уведомление",
                message: "Изменение организации успешно подтвержденно",
                type: "success"
            });

            this.setState({ isShowBackdrop: false })
        });
    }
    onDisableChange = (id, message) => {
        if (!message) {
            this.setState({
                dialogRejectRequest: id
            })

            return null
        }

        this.setState({isShowBackdrop: true, dialogRejectRequest: ''});

        axiosInstance.put(`${apiUrls['reject-legal-info-request']}/${id}`, {
            rejectionReason: message
        }).then((res) => {
            this.getLegalInfoRequests();

            alertNotification({
                title: "Системное уведомление",
                message: "Изменение организации отклонено",
                type: "success"
            });

            this.setState({ isShowBackdrop: false })
        });
    }

    render() {
        const {rows, pagination, filter, isLoading, dialogRejectRequest} = this.state;

        return (
            <>

                <Box mb={3}>
                    <Typography variant="h1">Запросы об изменении организации</Typography>
                </Box>

                <Box mb={2}></Box>

                <Box>
                    <TableComponent
                        rows={rows}
                        filter={filter}
                        pagination={pagination}
                        totalCountRows={this.state.totalCountRows}

                        isLoading={isLoading}

                        onChangeFilter={this.onChangeFilter}
                        onAllowChange={this.onAllowChange}
                        onDisableChange={this.onDisableChange}
                    />
                </Box>

                <DialogRejectRequestComponent
                    isOpen={Boolean(dialogRejectRequest)}
                    id={dialogRejectRequest}

                    onClose={() => this.setState({dialogRejectRequest: ""})}
                    onReject={this.onDisableChange}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default OrganizationChangeRequests
