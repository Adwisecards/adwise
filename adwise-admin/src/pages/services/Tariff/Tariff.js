import React, { Component } from "react";
import {
    Box,

    Button,
    Tooltip,

    Grid,

    Typography, CircularProgress, Backdrop
} from "@material-ui/core";
import {
    Table,
    EditTariff,
    CreateTariff,
    ModalDeleteConfirm
} from "./components";

import {store} from "react-notifications-component";
import {Plus as PlusIcon} from "react-feather";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import alertNotification from "../../../common/alertNotification";

class Tariff extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tariffs: [],

            deleteTariff: {},
            editTariff: {},

            isLoading: true,
            isUseWiseDefault: false,
            isShowBackdrop: false,
            isOpenTariff: false,
            isOpenConfirmDelete: false,
        };
    }

    componentDidMount = () => {
        this.onGetTariffs();
    }

    onGetTariffs = () => {
        const urlApi = `?all=1`;

        axiosInstance.get(`${ apiUrls["get-packets"] }${ urlApi }`).then((response) => {
            const isUseWiseDefault = response.data.data.packets.find((item) => item.wiseDefault && !item.disabled);

            this.setState({
                tariffs: response.data.data.packets,
                isUseWiseDefault: !!isUseWiseDefault,
                isLoading: false
            })
        });
    }

    onCreateTariff = (form, events) => {
        this.setState({ isShowBackdrop: true });

        axiosInstance.post(apiUrls["create-packet"], form).then((response) => {
            this.setState({
                isShowBackdrop: false,
                isOpenTariff: false,
            });

            this.onGetTariffs();

            alertNotification({
                title: 'Системное уведомление',
                message: 'Пакет успешно создан',
                type: 'success'
            })
        }).catch((error) => {
            this.setState({
                isShowBackdrop: false
            });

            alertNotification({
                title: 'Системное уведомление',
                message: 'Ошибка создания тарифа',
                type: 'success'
            })
        });
    }

    onDeleteTariff = (deleteTariff, isConfirm = false) => {
        // if (!isConfirm){
        //     this.setState({
        //         deleteTariff,
        //         isOpenConfirmDelete: true
        //     });
        //
        //     return null
        // }
        //
        // this.setState({ isShowBackdrop: true });
        //
        // axiosInstance.delete(`${apiUrls["delete-packet"]}/${deleteTariff._id}`).then((response) => {
        //     this.setState({
        //         isShowBackdrop: true,
        //         isOpenConfirmDelete: false,
        //     });
        //
        //     this.onGetTariffs();
        //
        //     alertNotification({
        //         title: 'Системное уведомление',
        //         message: 'Пакет успешно удален',
        //         type: 'success'
        //     })
        // }).catch((error) => {
        //     this.setState({
        //         isShowBackdrop: true,
        //         isOpenConfirmDelete: false,
        //     });
        //
        //     alertNotification({
        //         title: 'Системное уведомление',
        //         message: 'Ошибка удаления тарифа',
        //         type: 'danger'
        //     })
        // })
    }
    onDisabledPacket = (row) => {
        this.setState({ isShowBackdrop: true });

        axiosInstance.put(`${ apiUrls["set-packet-disabled"] }/${ row._id }`, {
            disabled: !row.disabled
        }).then((response) => {
            this.setState({
                isShowBackdrop: false
            });

            this.onGetTariffs();

            alertNotification({
                title: 'Системное уведомление',
                message: `Тариф успешно ${ !row.disabled ? 'отключен' : 'включен' }`,
                type: 'success'
            })
        }).catch((error) => {
            this.setState({
                isShowBackdrop: false
            });

            alertNotification({
                title: 'Системное уведомление',
                message: `Ошибка ${ !row.disabled ? 'отключения' : 'включения' } тарифа`,
                type: 'danger'
            })
        });
    }

    onOpenModalCreateTariff = () => {
        this.setState({ isOpenTariff: true });
    }

    onEdit = (tariff, confirmation) => {
        if (!confirmation) {
            this.setState({
                editTariff: tariff
            });

            return null
        }

        this.setState({
            isShowBackdrop: true
        });

        axiosInstance.put(`${apiUrls["update-packet"]}/${tariff._id}`, tariff).then((res) => {
            this.onGetTariffs();

            this.setState({
                editTariff: {},
                isShowBackdrop: false
            });
        })
    }

    render() {
        const { editTariff, tariffs, isLoading, isUseWiseDefault } = this.state;

        return (
            <>

                <Box mb={4}>
                    <Grid container spacing={2} justify="space-between">

                        <Grid item>
                            <Typography variant="h1">Тарифы</Typography>
                        </Grid>

                        <Grid item>
                            <Tooltip title="Создать тариф">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    style={{padding: 10, minWidth: 0}}

                                    onClick={this.onOpenModalCreateTariff}
                                >
                                    <PlusIcon/>
                                </Button>
                            </Tooltip>
                        </Grid>

                    </Grid>
                </Box>

                <Box>
                    <Table
                        rows={tariffs}

                        isLoading={isLoading}

                        onDelete={this.onDeleteTariff}
                        onEdit={this.onEdit}
                        onDisabledPacket={this.onDisabledPacket}
                    />
                </Box>

                <CreateTariff
                    isOpen={this.state.isOpenTariff}
                    isUseWiseDefault={isUseWiseDefault}
                    onCreateTariff={this.onCreateTariff}
                    onClose={() => this.setState({isOpenTariff: false})}
                />

                <EditTariff
                    isOpen={Boolean(Object.keys(editTariff).length > 0)}
                    initialForm={editTariff}

                    onChangeTariff={this.onEdit}
                    onClose={() => this.setState({editTariff: {}})}
                />

                <ModalDeleteConfirm
                    isOpen={this.state.isOpenConfirmDelete}
                    item={this.state.deleteTariff}
                    onDelete={this.onDeleteTariff}
                    onClose={() => this.setState({isOpenConfirmDelete: false})}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default Tariff
