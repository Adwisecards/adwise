import React, {Component} from "react";
import {
    Box,
    Grid,
    Button,
    Typography, Tooltip, CircularProgress, Backdrop,
    Switch,
} from "@material-ui/core";
import {
    Table,
    Filter,
    CreateSaleLicense,
    EnterSaleLicense
} from "./components";
import {
    Plus as PlusIcon,
    Edit2 as Edit2Icon
} from "react-feather";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import alertNotification from "../../../common/alertNotification";
import {getPageFromCount} from "../../../common/pagination";
import {ExcelIcon} from "../../../icons";

class SaleLicenses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            packets: [],
            listPackets: [],

            filter: {
                sortBy: 'timestamp',
                order: -1,

                pageSize: 20,
                pageNumber: 1,

                "organization._id": "",
                "manager._id": "",
                "packet._id": ""
            },
            pagination: {
                countPages: 1
            },

            totalCountRows: 0,

            isOld: false,
            isLoading: true,
            isShowBackdrop: false,
            isOpenCreateSale: false,
            isOpenEnterSaleLicense: false
        };
    }

    componentDidMount = () => {
        this.getListPackets();
        this.getPackets();
    }

    getListPackets = () => {
        this.setState({isLoading: true});

        const searchUrl = this.getFilter();

        axiosInstance.get(`${apiUrls["find-sold-packets"]}${searchUrl}&old=${this.state.isOld.toString()}`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                packets: response.data.data.packets,
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
        });

        return `?${filters.join('&')}`
    }

    getPackets = () => {
        axiosInstance.get(`${ apiUrls["get-packets"] }`).then((response) => {
            this.setState({
                listPackets: response.data.data.packets
            })
        });
    }

    onChangeFilter = (filter, isFastStart = false) => {
        this.setState({filter}, () => {
            if (isFastStart) {
                this.getListPackets();
            }
        });
    }

    onCreateSaleLicense = (form, events) => {
        this.setState({ isShowBackdrop: true });

        const body = {
            packetId: form.packetId,
            date: form.date,
            organizationId: form.organizationId,
            reason: form.reason
        };

        axiosInstance.put(`${ apiUrls["add-packet-to-organization"] }`, body).then((response) => {

            this.setState({
                isShowBackdrop: false,
                isOpenCreateSale: false
            });

            this.getListPackets();

            alertNotification({
                title: "Системное уведомление",
                message: "Продажи лицензии успешно создана",
                type: "success"
            })

        }).catch((error) => {
          this.setState({
              isShowBackdrop: false
          });

          alertNotification({
              title: "Системное уведомление",
              message: "Ошибка создания продажи лицензии",
              type: "danger"
          })
        })
    }
    onEnterPacketOrganization = (body) => {
        this.setState({ isShowBackdrop: true });

        axiosInstance.put(`${ apiUrls["add-packet-to-organization"] }`, body).then((response) => {

            this.setState({
                isShowBackdrop: false,
                isOpenEnterSaleLicense: false
            });

            this.getListPackets();

            alertNotification({
                title: "Системное уведомление",
                message: "Продажи лицензии успешно создана",
                type: "success"
            })

        }).catch((error) => {
            this.setState({
                isShowBackdrop: false
            });

            alertNotification({
                title: "Системное уведомление",
                message: "Ошибка создания продажи лицензии",
                type: "danger"
            })
        })
    }

    onExportSaleLicenses = () => {
        this.setState({isShowBackdrop: true});

        const filterSearch = this.getFilter();

        axiosInstance.get(`${apiUrls["find-sold-packets"]}${filterSearch}&export=1`, {
                method: 'GET',
                responseType: 'blob'
            }
        ).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sale-licenses.xlsx');
            document.body.appendChild(link);
            link.click();

            this.setState({isShowBackdrop: false});
        }).catch(() => {
            this.setState({isShowBackdrop: false});
        })
    }

    onChangeOld = () => {
        this.setState({isOld: !this.state.isOld}, () => {
           this.getListPackets();
        });
    }

    render() {
        const {packets, listPackets, pagination, filter, isLoading} = this.state;

        return (
            <>

                <Box mb={4}>
                    <Grid container spacing={2} justify="space-between">

                        <Grid item>
                            <Grid container spacing={3} alignItems="center">
                                <Grid item>
                                    <Typography variant="h1">Продажа лицензий</Typography>
                                </Grid>
                                <Grid item>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography variant="formTitle">Новые записи</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Switch
                                                color="primary"
                                                value={this.state.isOld}
                                                checked={this.state.isOld}
                                                onChange={this.onChangeOld}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="formTitle">Старые записи</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Tooltip title="Выгрузить XLS">
                                        <Button onClick={this.onExportSaleLicenses}>

                                            <ExcelIcon/>

                                        </Button>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Tooltip title="Добавить запрос на продажу">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            style={{padding: 10, minWidth: 0}}

                                            onClick={() => this.setState({ isOpenEnterSaleLicense: true })}
                                        >
                                            <Edit2Icon/>
                                        </Button>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Tooltip title="Создать запрос на продажу">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            style={{padding: 10, minWidth: 0}}

                                            onClick={() => this.setState({ isOpenCreateSale: true })}
                                        >
                                            <PlusIcon/>
                                        </Button>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                </Box>

                <Box mb={3}>
                    <Filter
                        filter={filter}
                        listPackets={listPackets}

                        onChange={this.onChangeFilter}
                        onSearch={this.getListPackets}
                    />
                </Box>

                <Box>
                    <Table
                        rows={packets}
                        filter={filter}
                        pagination={pagination}
                        totalCountRows={this.state.totalCountRows}

                        isLoading={isLoading}

                        onChangeFilter={this.onChangeFilter}
                    />
                </Box>

                <CreateSaleLicense
                    isOpen={this.state.isOpenCreateSale}

                    onCreateSaleLicense={this.onCreateSaleLicense}
                    onClose={() => this.setState({ isOpenCreateSale: false })}
                />

                <EnterSaleLicense
                    isOpen={this.state.isOpenEnterSaleLicense}
                    onCreateSaleLicense={this.onEnterPacketOrganization}
                    onClose={() => this.setState({isOpenEnterSaleLicense: false})}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default SaleLicenses
