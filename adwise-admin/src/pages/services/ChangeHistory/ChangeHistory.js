import React, { Component } from "react";
import {
    Box,
    Grid,
    Button,
    Tooltip,
    Typography,
    CircularProgress,
    Backdrop
} from "@material-ui/core";
import {
    Table,
    Filter,
    ModalEditChange,
    ModalCreateChange,
    ModalDeleteConfirm
} from "./components";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import {Plus as PlusIcon} from "react-feather";
import alertNotification from "../../../common/alertNotification";

class ChangeHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            сhangeHistory: [],

            filter: {
                sortBy: 'timestamp',
                order: -1,

                pageSize: 20,
                pageNumber: 1,

                type: 'cards'
            },
            pagination: {},
            editingVersion: {},
            deleteVersion: {},

            totalCountRows: 0,

            isLoading: true,
            isOpenModalCreate: false,
            isShowBackdrop: false,
            isOpenDeleteConfirm: false
        };
    }

    componentDidMount = () => {
        this.getListChanges();
    }

    getListChanges = () => {
        this.setState({isLoading: true});

        const searchUrl = this.getFilter();

        axiosInstance.get(`${ apiUrls["versions-get-versions"] }${ searchUrl }`).then((response) => {
            this.setState({
                isLoading: false,
                сhangeHistory: response.data.data.versions
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
                this.getListChanges();
            }
        })
    }

    onOpenCreateHistory = () => {
        this.setState({ isOpenModalCreate: true });
    }
    onCreateHistory = (form) => {
        this.setState({ isShowBackdrop: true });

        axiosInstance.post(apiUrls["versions-create-version"], form).then((response) => {
            this.setState({
                isShowBackdrop: false,
                isOpenModalCreate: false
            });

            alertNotification({
                title: "Системное уведомление",
                message: "Версия успешно создана",
                type: "success"
            });

            this.getListChanges();
        }).catch((error) => {
            this.setState({ isShowBackdrop: false });

            alertNotification({
                title: "Системное уведомление",
                message: "Ошибка создания версии",
                type: "danger"
            })
        });
    }

    onDeleteVersion = (version, isConfirmation = false) => {
        if (!isConfirmation){
            this.setState({
                isOpenDeleteConfirm: true,
                deleteVersion: version
            });

            return null
        }

        this.setState({
            isShowBackdrop: true
        });

        axiosInstance.delete(`${ apiUrls["versions-delete-version"] }/${ version._id }`).then((response) => {
            this.setState({
                isShowBackdrop: false,
                isOpenDeleteConfirm: false,
            });

            alertNotification({
                title: "Системное уведомление",
                message: "Версия успешно удалена",
                type: "success"
            });

            this.getListChanges();
        }).catch((error) => {
            this.setState({
                isShowBackdrop: false,
                isOpenDeleteConfirm: false,
            });

            alertNotification({
                title: "Системное уведомление",
                message: "Ошибка удаления версии",
                type: "danger"
            })
        });
    }

    onEditVersion = (version, isSaving) => {
        if (!isSaving) {
            this.setState({
                editingVersion: version
            })

            return null
        }

        this.setState({ isShowBackdrop: true });

        axiosInstance.put(`${apiUrls["versions-update-version"]}/${version._id}`, version).then((res) => {

            this.getListChanges();

            this.setState({
                isShowBackdrop: false,
                editingVersion: {}
            });
        }).catch((error) => {
            alertNotification({
                title: "Ошибка",
                message: "Возникла ошибка при сохранении",
                type: "danger"
            })

            this.setState({
                isShowBackdrop: false
            });
        })
    }

    render() {
        const {
            сhangeHistory,
            filter,
            pagination,
            isLoading,
            totalCountRows,
            isOpenModalCreate,
            editingVersion
        } = this.state;

        return (
            <>

                <Box mb={4}>
                    <Grid container justify="space-between" alignItems="center">
                        <Typography variant="h1">История изменения</Typography>

                        <Tooltip title="Добавить историю изменения">
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                style={{padding: 10, minWidth: 0}}

                                onClick={this.onOpenCreateHistory}
                            >
                                <PlusIcon/>
                            </Button>
                        </Tooltip>
                    </Grid>
                </Box>

                <Box mb={5}>
                    <Filter
                        filter={filter}

                        onSearch={this.getListChanges}
                        onChange={this.onChangeFilter}
                    />
                </Box>

                <Box>
                    <Table
                        rows={сhangeHistory}
                        filter={filter}
                        pagination={pagination}
                        totalCountRows={totalCountRows}

                        isLoading={isLoading}

                        onChangeFilter={this.onChangeFilter}
                        onDeleteVersion={this.onDeleteVersion}
                        onEditVersion={this.onEditVersion}
                    />
                </Box>


                <ModalCreateChange
                    isOpen={isOpenModalCreate}

                    onClose={() => this.setState({ isOpenModalCreate: false })}
                    onSubmit={this.onCreateHistory}
                />

                <ModalDeleteConfirm
                    item={this.state.deleteVersion}

                    isOpen={this.state.isOpenDeleteConfirm}
                    onClose={() => this.setState({ isOpenDeleteConfirm: false })}
                    onDelete={this.onDeleteVersion}
                />

                <ModalEditChange
                    isOpen={Boolean(Object.keys(editingVersion).length > 0)}
                    initialForm={this.state.editingVersion}
                    onSubmit={this.onEditVersion}
                    onClose={() => this.setState({ editingVersion: {} })}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>
            </>
        );
    }
}

export default ChangeHistory
