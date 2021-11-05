import React, {Component} from "react";
import {
    Box,

    Grid,

    Button,

    Typography,

    CircularProgress,
    Backdrop,

    Tooltip, Paper, TextField, Collapse
} from "@material-ui/core";
import {
    Table,
    Filter,
    ModalEdit,
    BalanceAdjustment,
    OrganizationModal,
    OrganizationSetting,
    DialogEditDeposite
} from "./components";
import {
    CornerRightDown as CornerRightDownIcon,
    CornerRightUp as CornerRightUpIcon,
} from "react-feather";
import {
    ConfirmationDialog
} from "../../../components";
import {ExcelIcon} from "../../../icons";
import {store} from "react-notifications-component";
import {getPageFromCount} from "../../../common/pagination";

import alertNotification from "../../../common/alertNotification";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import queryString from "query-string";

class Organizations extends Component {
    constructor(props) {
        super(props);

        const settings = localStorage.getItem('settings_system');

        const searchString = this.props.history.location.search;
        const searchParams = queryString.parse(searchString);

        this.state = {

            organizations: [],
            tariffs: [],

            filter: {
                sortBy: 'name',
                order: 1,

                pageSize: searchParams.pageSize || 40,
                pageNumber: 1,

                name: '',
                verified: searchParams.verified || '',
                disabled: searchParams.disabled || '',
                manager: searchParams.manager || '',
                _id: searchParams._id || '',
            },
            pagination: {
                countPages: 1
            },
            globalSettings: {},
            organizationSetting: {},
            itemBalanceAdjustment: {},
            organizationBankDateils: {},
            organizationModalEdit: {},
            organizationModal: {},
            organizationGlobal: {},
            editedDepositSum: {},
            settingsSystem: !!settings ? JSON.parse(settings) : null,

            totalCountRows: 0,

            isLoading: true,
            isOpenControlsPage: false,
            isShowBackdrop: false,
            isOpenBalanceAdjustment: false,
            isOpenConfirmationDialog: false,
            isOpenSettingOrganization: false,
            isOpenOrganizationBankDateils: false
        };
    }

    componentDidMount = () => {
        this.props.history.replace('/organizations');

        this.getListOrganizations();
        this.getAllTariffs();
        this.getGlobalSettings();
    }

    getListOrganizations = () => {
        this.setState({isLoading: true});

        const filterSearch = this.getFilter();

        axiosInstance.get(`${apiUrls["find-organizations"]}${filterSearch}`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                organizations: response.data.data.organizations,
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
            if (
                !!filter[key] &&
                key !== 'disabled' &&
                key !== 'verified'
            ) {
                filters.push(`${key}=${filter[key]}`)
            }

            if (key === 'disabled' && filter[key] !== '') {
                filters.push(`disabled=${filter[key]}`);
            }
            if (key === 'verified' && filter[key] !== '') {
                filters.push(`verified=${filter[key]}`);
            }
        });

        return `?${filters.join('&')}`
    }

    getGlobalSettings = () => {
        axiosInstance.get(apiUrls["get-global"]).then((response) => {
            this.setState({
                globalSettings: response.data.data.global
            })
        })
    }

    getAllTariffs = () => {
        axiosInstance.get(apiUrls["get-packets"]).then((response) => {
            this.setState({
                tariffs: response.data.data.packets
            })
        });
    }

    onChangeFilter = (filter, isFastStart = false) => {
        this.setState({filter}, () => {
            if (isFastStart) {
                this.getListOrganizations();
            }
        });
    }

    onExportOrganization = () => {
        this.setState({ isShowBackdrop: true });

        const filterSearch = this.getFilter();

        axiosInstance.get(`${apiUrls["find-organizations"]}${filterSearch}&export=1`, {
                method: 'GET',
                responseType: 'blob'
            }
        ).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'organizations.xlsx');
            document.body.appendChild(link);
            link.click();

            this.setState({ isShowBackdrop: false });
        })
    }

    onOpenSettingOrganization = (organizationSetting) => {
        this.setState({
            organizationSetting,
            isOpenSettingOrganization: true
        })
    }

    onSetPacketOrganization = (organizationId, packetId) => {
        this.setState({isShowBackdrop: true});

        axiosInstance.put(`${apiUrls["set-organization-packet"]}/${organizationId}`, {
            packetId,
            noRecord: true
        }).then((response) => {
            this.setState({
                isShowBackdrop: false,
                isOpenSettingOrganization: false
            })

            alertNotification({
                title: "Системное уведомление",
                message: "Пакет успешно изменен",
                type: "success"
            });

            this.getListOrganizations();
        }).catch((error) => {
            this.setState({
                isShowBackdrop: false
            })

            alertNotification({
                title: "Системное уведомление",
                message: "Ошибка изменения пакета",
                type: "danger"
            });
        })
    }

    onChangeDisabledOrganization = (row) => {
        this.setState({isShowBackdrop: true});


        axiosInstance.put(`${apiUrls["set-organization-disabled"]}/${row._id}`, {
            disabled: !row.disabled
        }).then((response) => {
            this.setState({isShowBackdrop: false});

            alertNotification({
                title: "Системное уведомление",
                message: `Организация успешно ${!row.disabled ? 'Выключена' : 'Включена'}`,
                type: "success"
            })

            row.disabled = !row.disabled

            this.setState({organizations: this.state.organizations})

            // this.getListOrganizations();
        }).catch((error) => {
            this.setState({isShowBackdrop: false});

            alertNotification({
                title: "Системное уведомление",
                message: "Ошибка изменения статуса организации",
                type: "danger"
            })

        });
    }

    onOpenBalanceAdjustment = (row) => {
        this.setState({
            itemBalanceAdjustment: row,
            isOpenBalanceAdjustment: true
        })
    }
    onSetBalanceAdjustment = (row, data) => {
        this.setState({isShowBackdrop: true});

        axiosInstance.put(`${apiUrls["correct-balance"]}/${row.wallet._id}`, {
            change: Number(data.amount),
            // type: data.type
        }).then((response) => {
            this.setState({
                isShowBackdrop: false,
                isOpenBalanceAdjustment: false
            })

            alertNotification({
                title: "Системное уведомление",
                message: "Сумма успешно отредактирована",
                type: "success"
            });

            this.getListOrganizations();
        }).catch((error) => {
            let message = error.response.data.error.message;

            if (message === 'Not enough points in wallet') {
                message = "Не хватает баланса для редактирования"
            }

            this.setState({
                isShowBackdrop: false
            })

            alertNotification({
                title: "Системное уведомление",
                message: message,
                type: "danger"
            });
        });
    }

    onChangeSignedContract = (row) => {

        axiosInstance.put(`${apiUrls["set-organization-signed"]}/${row._id}`, {
            signed: !row.signed
        }).then((response) => {
            this.setState({isShowBackdrop: false});

            alertNotification({
                title: "Системное уведомление",
                message: `Статус договор организация успешно изменен`,
                type: "success"
            })

            row.signed = !row.signed;

            this.setState({organizations: this.state.organizations});
        }).catch((error) => {
            this.setState({isShowBackdrop: false});

            alertNotification({
                title: "Системное уведомление",
                message: "Ошибка изменения статуса договора организации",
                type: "danger"
            })

        })

        console.log('onChangeSignedContract: ', row);
    }

    onOpenBankDetails = (row) => {
        this.setState({
            isOpenOrganizationBankDateils: true,
            organizationBankDateils: row
        })
    }

    onChangeCash = (row) => {
        this.setState({isShowBackdrop: true});

        axiosInstance.put(`${apiUrls["organization-set-organization-cash"]}/${row._id}`, {
            cash: !row.cash
        }).then((response) => {
            alertNotification({
                title: "Системное уведомление",
                message: (!row.cash) ? `Наличные платежи организации ${row.name} успешно включены` : `Наличные платежи организации ${row.name} успешно выключены`,
                type: "success"
            });

            row.cash = !row.cash;

            this.setState({
                organizations: this.state.organizations,
                isShowBackdrop: false
            });
        }).catch((error) => {
            alertNotification({
                title: "Системное уведомление",
                message: "Не возможно изменить платежность организации",
                type: "danger"
            });
        })
        console.log('row: ', row);
    }
    onChangeOnlinePayment = (row) => {
        axiosInstance.put(`${ apiUrls['organization-set-organization-online'] }/${ row._id }`, {
            online: !row.online
        }).then((response) => {
            row.online = !row.online;

            this.setState({ organizations: this.state.organizations })

            alertNotification({
                title: "Системное уведомление",
                message: "Организация успешно обновлена",
                type: "success"
            })
        });
    }

    onSetPaymentType = (data) => {
        this.setState({isShowBackdrop: true});

        axiosInstance.put(`${apiUrls["organization-set-organization-payment-type"]}${data.organizationId}`, {
            paymentType: data.paymentType
        }).then((response) => {

            this.setState({isShowBackdrop: false});

            alertNotification({
                title: "Системное уведомление",
                message: "Платежный тип успешно изменен",
                type: "success"
            })

            this.getListOrganizations();

        }).catch((error) => {
            this.setState({isShowBackdrop: false});

            alertNotification({
                title: "Системное уведомление",
                message: "Не удалость изменить платежный тип",
                type: "danger"
            })
        })
    }

    onOpenOrganizationEdit = (organization) => {
        this.setState({
            isModalEdit: true,
            organizationModalEdit: organization
        })
    }
    onEditOrganization = (form) => {
        this.setState({isShowBackdrop: true});

        let organization = {...this.state.organizationModalEdit};
        let formData = new FormData();
        let legal = {...organization.legal};
        let phones = [...organization.phones];

        if (!legal.info) {
            legal.info = {}
        }

        legal.info.inn = form.inn;
        legal.info.fullName = form.fullName;
        phones[0] = form.phones.replace(/[^\d]/g, '');

        formData.append('phones', phones.join(', '));
        formData.append('legal', JSON.stringify(legal));

        axiosInstance.put(`${apiUrls["organization-update-organization"]}${organization._id}`, formData).then((response) => {
            this.setState({
                isShowBackdrop: false,
                isModalEdit: false,
            });

            alertNotification({
                title: "Системное уведомление",
                message: "Данные успешно изменены",
                type: "success"
            });

            this.getListOrganizations();
        }).catch((error) => {
            alertNotification({
                title: "Системное уведомление",
                message: "Смотри консаоль",
                type: "error"
            });
        })
    }

    onChangeTips = (row) => {
        this.setState({isShowBackdrop: true});

        row.tips = !row.tips;

        axiosInstance.put(`${apiUrls["organization-set-organization-tips"]}/${row._id}`, {
            tips: row.tips
        }).then((response) => {

            alertNotification({
                title: "Системное уведомление",
                message: `Чаевые успешно ${row.tips ? 'включены' : 'отключены'}`,
                type: "success"
            });

            this.setState({
                isShowBackdrop: false,
                organizations: this.state.organizations
            });

        }).catch((error) => {

            this.setState({isShowBackdrop: false});

            alertNotification({
                title: "Системное уведомление",
                message: `Произошла ошибка, смоти консоль`,
                type: "danger"
            });

            console.log('error: ', error.response)

        });
    }

    onOpenOrganization = (row) => {
        this.setState({
            organizationModal: row
        })
    }

    setOrganizationGlobal = (organization, confirm) => {
        if (!confirm) {
            this.setState({
                organizationGlobal: organization,
                isOpenConfirmationDialog: true
            });

            return null
        }

        this.setState({isOpenConfirmationDialog: false});

        axiosInstance.put(`${apiUrls["organization-set-organization-global"]}/${organization._id}`, {
            organizationId: organization._id
        }).then((response) => {
            alertNotification({
                title: "Системное уведомление",
                message: "Глабальная организация успешно изменена",
                type: "success"
            });

            this.getGlobalSettings();
        });
    }

    onEditDeposit = (organization, isEdit) => {
        if (!isEdit) {
            this.setState({
                editedDepositSum: organization
            })

            return null
        }

        this.setState({isShowBackdrop: true});

        axiosInstance.post(`${apiUrls['organization-set-deposit']}/${organization.wallet._id}`, {
            deposit: Number.parseFloat(organization.validForm.depost)
        }).then((response) => {
            this.setState({isShowBackdrop: false, editedDepositSum: {}})

            alertNotification({
                title: "Успешно",
                message: "Депозит организации успешно изменен",
                type: "success"
            })

            this.getListOrganizations();
        }).catch((error) => {

            this.setState({isShowBackdrop: false});

            alertNotification({
                title: "Ошибка",
                type: "danger",
                message: error?.response?.data?.error?.message || "Произошла ошибка изменения депозита организации"
            })

        })
    }

    render() {
        const {
            organizations, filter, pagination, settingsSystem, isOpenControlsPage, isLoading,
            isOpenConfirmationDialog, organizationGlobal
        } = this.state;
        const { global } = this.props;
        const { isAdminGuest } = global;

        const isMinimalDisplay = (settingsSystem) ? settingsSystem.display === 'min' : true;

        return (
            <>

                <Box mb={isMinimalDisplay ? 1 : 4}>

                    <Grid container spacing={3} alignItems="center" justify="space-between">

                        <Grid item>

                            <Typography variant="h1">Организации</Typography>

                        </Grid>

                        <Grid item>

                            <Grid container spacing={2}>
                                <Grid item>
                                    <Tooltip title="Выгрузить XLS">
                                        <Button onClick={this.onExportOrganization}>

                                            <ExcelIcon/>

                                        </Button>
                                    </Tooltip>
                                </Grid>

                                {
                                    isMinimalDisplay && (
                                        <Grid item>

                                            <Tooltip
                                                title={isOpenControlsPage ? 'Свернуть управление' : 'Развернуть управление'}>
                                                <Button
                                                    onClick={() => this.setState({isOpenControlsPage: !isOpenControlsPage})}>

                                                    {isOpenControlsPage ? (
                                                        <CornerRightUpIcon/>
                                                    ) : (
                                                        <CornerRightDownIcon/>
                                                    )}

                                                </Button>
                                            </Tooltip>
                                        </Grid>
                                    )
                                }
                            </Grid>

                        </Grid>

                    </Grid>

                </Box>

                <Collapse in={isMinimalDisplay ? isOpenControlsPage : true}>

                    <Paper elevation={0}>

                        <Box mb={isMinimalDisplay ? 1 : 5}>

                            <Filter
                                filter={filter}

                                onSearch={this.getListOrganizations}
                                onChange={this.onChangeFilter}
                            />

                        </Box>

                    </Paper>

                </Collapse>

                <Box>

                    <Table
                        rows={organizations}
                        filter={filter}
                        totalCountRows={this.state.totalCountRows}
                        pagination={pagination}
                        globalIdOrganization={this.state.globalSettings.organization}

                        isLoading={isLoading}
                        isAdminGuest={isAdminGuest}

                        onOpenSetting={this.onOpenSettingOrganization}
                        onChangeDisabled={this.onChangeDisabledOrganization}
                        onChangeFilter={this.onChangeFilter}
                        onOpenBalanceAdjustment={this.onOpenBalanceAdjustment}
                        onChangeSignedContract={this.onChangeSignedContract}
                        onOpenBankDetails={this.onOpenBankDetails}
                        onChangeCash={this.onChangeCash}
                        onSetPaymentType={this.onSetPaymentType}
                        onOpenOrganizationEdit={this.onOpenOrganizationEdit}
                        onChangeTips={this.onChangeTips}
                        onOpenOrganization={this.onOpenOrganization}
                        onSetOrganizationGlobal={this.setOrganizationGlobal}
                        onChangeOnlinePayment={this.onChangeOnlinePayment}
                        onEditDeposit={this.onEditDeposit}
                    />

                </Box>

                <OrganizationSetting
                    isOpen={this.state.isOpenSettingOrganization}
                    tariffs={this.state.tariffs}
                    organization={this.state.organizationSetting}

                    onSetPacket={this.onSetPacketOrganization}
                    onChangeDisabled={this.onChangeDisabledOrganization}
                    onClose={() => this.setState({isOpenSettingOrganization: false})}
                />

                <BalanceAdjustment
                    item={this.state.itemBalanceAdjustment}

                    isOpen={this.state.isOpenBalanceAdjustment}

                    onSubmit={this.onSetBalanceAdjustment}
                    onClose={() => this.setState({isOpenBalanceAdjustment: false})}
                />

                <ModalEdit
                    isOpen={this.state.isModalEdit}

                    initForm={this.state.organizationModalEdit}

                    onClose={() => this.setState({isModalEdit: false})}
                    onEdit={this.onEditOrganization}
                />

                <OrganizationModal
                    isOpen={Boolean(Object.keys(this.state.organizationModal).length > 0)}
                    organization={this.state.organizationModal}
                    onClose={() => this.setState({organizationModal: {}})}
                />

                <ConfirmationDialog
                    isOpen={isOpenConfirmationDialog}

                    title="Подтверждение"
                    message={`Вы действительно хотите назначить организацию "${organizationGlobal?.name}" глобальной?`}
                    titleButton="Да, назначить"

                    onClose={() => this.setState({isOpenConfirmationDialog: false})}
                    onConfirm={() => this.setOrganizationGlobal(organizationGlobal, true)}
                />

                <DialogEditDeposite
                    isOpen={Object.keys(this.state.editedDepositSum).length > 0}
                    organization={this.state.editedDepositSum}
                    onClose={() => this.setState({editedDepositSum: {}})}
                    onEdit={this.onEditDeposit}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default Organizations
