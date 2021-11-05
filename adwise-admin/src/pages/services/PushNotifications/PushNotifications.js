import React, {Component} from "react";
import {
    Box,
    Grid,
    Tooltip,
    Typography,
    Button,
    IconButton,

    Tabs,
    Tab, CircularProgress, Backdrop
} from "@material-ui/core";
import {
    Send as SendIcon,
    Plus as PlusIcon
} from "react-feather";
import {
    Sample,
    SampleCreated,
    SendPushNotification,
    Sent,
    DialogUsers
} from "./components";

import {store} from "react-notifications-component";
import {withStyles} from "@material-ui/styles";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import moment from "moment";
import alertNotification from "../../../common/alertNotification";
import {getPageFromCount} from "../../../common/pagination";

class PushNotifications extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: 'sent',

            totalCountRowsSend: 0,
            totalCountRowsSample: 0,

            sends: [],
            sample: [],
            dialogUsers: [],

            filterSend: {
                sortBy: 'timestamp',
                order: -1,

                pageSize: 20,
                pageNumber: 1,
            },
            filterSample: {
                sortBy: 'timestamp',
                order: -1,

                pageSize: 20,
                pageNumber: 1,
            },
            paginationSend: {
                countPages: 1
            },
            paginationSample: {
                countPages: 1
            },

            isLoadingSample: true,
            isLoadingSend: true,
            isOpenSampleCreated: false,
            isOpenSendPushNotification: false,
            isOpenDialogUsers: false,
            isShowBackdrop: false
        };
    }

    componentDidMount = () => {
        this.getPushNotifications();
        this.getSample();
    }

    getPushNotifications = () => {
        this.setState({ isLoadingSend: true })

        const search = this.getFilter(this.state.filterSend);
        axiosInstance.get(`${ apiUrls["find-notifications"] }${search}`).then((response) => {
            let paginationSend = {...this.state.paginationSend};
            paginationSend.countPages = getPageFromCount(response.data.data.count, this.state.filterSend.pageSize);

            this.setState({
                sends: response.data.data.notifications,
                paginationSend,
                totalCountRowsSend: response.data.data.count,
                isLoadingSend: false
            })
        })
    }
    getSample = () => {
        this.setState({ isLoadingSample: true })

        const search = this.getFilter(this.state.filterSample);
        axiosInstance.get(`${ apiUrls["find-receiver-groups"] }${search}`).then((response) => {
            let paginationSample = {...this.state.paginationSample};
            paginationSample.countPages = getPageFromCount(response.data.data.count, this.state.filterSample.pageSize);

            this.setState({
                sample: response.data.data.receiverGroups,
                paginationSample,
                totalCountRowsSample: response.data.data.count,
                isLoadingSample: false,
                isShowBackdrop: false,
            })
        })
    }
    getFilter = (filter) => {
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

    onChangeSend = (filterSend, isFast) => {
        this.setState({ filterSend }, () => {
            if (isFast) {
             this.getPushNotifications();
            }
        })
    }
    onChangeSample = (filterSample, isFast) => {
        this.setState({ filterSample }, () => {
            if (isFast){
                this.getSample();
            }
        })
    }

    onCreateSample = (form) => {
        this.setState({ isShowBackdrop: true });

        let parameters = {
            organizations: form.organizations.map((organization) => organization._id),
            hasPurchase: form.hasPurchase,
        };

        if (form.os) {
            parameters["os"] = form.os;
        }

        let body = {
            name: form.name,
            parameters: parameters
        }

        axiosInstance.post(`${ apiUrls["create-receiver-group"] }`, body).then((res) => {
            this.getSample();
            this.setState({ isShowBackdrop: false, isOpenSampleCreated: false });
            alertNotification({
                title: "Системное уведомление",
                message: "Выборка пользователей успешно создана",
                type: "success"
            })
        }).catch((error) => {
            this.setState({ isShowBackdrop: false });
            alertNotification({
                title: "Системное уведомление",
                message: "Произошла ошибка, проверьте правильность заполнения формы",
                type: "danger"
            })
        })
    }
    onUpdateSample = (id) => {
        this.setState({isShowBackdrop: true});

        axiosInstance.put(`${apiUrls["update-receiver-group"]}/${id}`).then((res) => {

            this.setState({isShowBackdrop: true});

            this.getSample();

            alertNotification({
                title: "Системное уведомление",
                message: "Выборка успешно обновлена",
                type: "success"
            })

        }).catch((error) => {

        });
    }
    onCreatePushNotification = (form) => {
        this.setState({ isShowBackdrop: true });

        let body = {
            title: form.title,
            body: form.message,
            type: 'common',
            data: {}
        };

        if (!!form.sample) {
            body['receiverGroupId'] = form.sample
        }
        if (!!form.receiverIds) {
            body['receiverIds'] = form.receiverIds.map((t) => t._id)
        }

        axiosInstance.post(`${ apiUrls["send-notification"] }`, body).then((response) => {
            this.getPushNotifications();
            this.setState({ isShowBackdrop: false, isOpenSendPushNotification: false });
            alertNotification({
                title: "Системное уведомление",
                message: "Сообщение успешно отправленно пользователям",
                type: "success"
            })
        }).catch(() => {
            this.setState({ isShowBackdrop: false });
            alertNotification({
                title: "Системное уведомление",
                message: "Произошла ошибка, проверьте правильность заполнения формы",
                type: "danger"
            })
        })
    }

    onOpenDialogUsers = (dialogUsers) => {
        this.setState({
            dialogUsers,
            isOpenDialogUsers: true
        })
    }

    render() {
        const {
            sends, sample,
            tab, isLoadingSample, isOpenSampleCreated,
            isOpenSendPushNotification, isLoadingSend,
            filterSend, filterSample, paginationSend,
            paginationSample, totalCountRowsSend,
            totalCountRowsSample
        } = this.state;
        const {classes} = this.props;

        return (
            <>
                <Box mb={2}>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="h1">Пуш уведомления</Typography>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Tooltip title="Отправить пуш уведомления">
                                        <Button
                                            variant="contained"
                                            className={classes.buttonHeader}
                                            onClick={() => this.setState({ isOpenSendPushNotification: true })}
                                        >
                                            <SendIcon color="white" size={20}/>
                                        </Button>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Tooltip title="Создать выборку пользователей">
                                        <Button
                                            variant="contained"
                                            className={classes.buttonHeader}
                                            onClick={() => this.setState({isOpenSampleCreated: true})}
                                        >
                                            <PlusIcon color="white" size={20}/>
                                        </Button>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={3}>
                    <Tabs value={tab} onChange={(event, tab) => this.setState({tab})}>
                        <Tab value="sent" label="Отправленные"/>
                        <Tab value="sample" label="Выборка"/>
                    </Tabs>
                </Box>

                <Box>
                    <Sent
                        rows={sends}

                        filter={filterSend}
                        pagination={paginationSend}
                        totalCountRows={totalCountRowsSend}

                        isShow={Boolean(tab === 'sent')}
                        isLoading={isLoadingSend}

                        onChangeFilter={this.onChangeSend}
                        onOpenDialogUsers={this.onOpenDialogUsers}
                    />
                    <Sample
                        rows={sample}

                        filter={filterSample}
                        pagination={paginationSample}
                        totalCountRows={totalCountRowsSample}

                        isShow={Boolean(tab === 'sample')}
                        isLoading={isLoadingSample}

                        onChangeFilter={this.onChangeSample}
                        onUpdateSample={this.onUpdateSample}
                        onOpenDialogUsers={this.onOpenDialogUsers}
                    />
                </Box>

                <SampleCreated
                    isOpen={isOpenSampleCreated}

                    onClose={() => this.setState({isOpenSampleCreated: false})}
                    onSubmit={this.onCreateSample}
                />

                <SendPushNotification
                    samples={sample}

                    isOpen={isOpenSendPushNotification}

                    onClose={() => this.setState({isOpenSendPushNotification: false})}
                    onSubmit={this.onCreatePushNotification}
                />

                <DialogUsers
                    isOpen={this.state.isOpenDialogUsers}
                    users={this.state.dialogUsers}
                    onClose={() => this.setState({ isOpenDialogUsers: false })}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

const styles = {
    buttonHeader: {
        padding: 0,
        minWidth: 0,
        width: 40,
        height: 40
    }
};

export default withStyles(styles)(PushNotifications)
