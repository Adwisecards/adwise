import React, { Component } from "react";
import {
    Box,
    Grid,
    Backdrop,
    Typography,
    CircularProgress, Button, Tooltip
} from "@material-ui/core";
import {
    Table,
    Filter,
    BalanceAdjustment,
    DialogChangeParent,
    DialogChangePassword
} from "./components";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import queryString from "query-string";
import alertNotification from "../../../common/alertNotification";
import {getPageFromCount} from "../../../common/pagination";
import {ExcelIcon} from "../../../icons";

class Users extends Component {
    constructor(props) {
        super(props);

        const searchString = this.props.history.location.search;
        const searchParams = queryString.parse(searchString);

        this.state = {
            users: [],

            filter: {
                pageNumber: 1,
                pageSize: 40,

                sortBy: 'firstName',
                order: 1,

                _id: searchParams._id || '',
                wisewinId: '',
                wallet: '',
                email: '',
                phone: '',
                admin: false,
                firstName: '',
                lastName: '',
                organization: '',
                sources: '',
                parentCrm: '',
                parentApp: ''
            },
            pagination: {
                countPages: 1
            },
            itemBalanceAdjustment: {},
            userChangePassword: {},
            userChangeParent: {},

            totalCountRows: 0,

            isLoading: true,
            isOpenBalanceAdjustment: false,
        };
    }

    componentDidMount = () => {
        this.getUsers();
    }

    getUsers = () => {
        this.setState({ isLoading: true });

        const searchUrl = this.getFilter();

        axiosInstance.get(`${ apiUrls["find-users"] }${ searchUrl }`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.pageSize);

            this.setState({
                users: response.data.data.users,
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
                key !== 'sources' &&
                key !== 'parentCrm' &&
                key !== 'parentApp'
            ) {
                filters.push(`${ key }=${ filter[key] }`)
            }
            if (!!filter[key] && (key === 'parentCrm' || key === 'parentApp')) {
                filters.push(`parent=${ filter[key] }`)
            }
            if (!filter[key]) {}
        });

        return `?${ filters.join('&') }`
    }

    onChangeFilter = (filter, isFastStart = false) => {
        this.setState({ filter }, () => {
            if (isFastStart) {
                this.getUsers();
            }
        })
    }

    onSetUserAdmin = (user) => {
        axiosInstance.put(`${ apiUrls['set-user-admin'] }/${ user._id }`, {
            admin: !user.admin
        }).then((response) => {
            alertNotification({
                title: "Систмное уведомление",
                message: `Пользователь ${ !user.admin ? 'назначен на должность' : 'уволен с должности' }  администратора`,
                type: "success"
            });

            this.getUsers();
        })
    }
    onSetUserGuest = (user) => {
        axiosInstance.put(`${ apiUrls["set-user-guest"] }/${ user._id }`, {
            adminGuest: !user.adminGuest
        }).then((response) => {
            alertNotification({
                title: "Систмное уведомление",
                message: `Пользователь ${ !user.adminGuest ? 'назначен на должность' : 'уволен с должности' } гостя`,
                type: "success"
            });

            this.getUsers();
        })
    }

    onOpenBalanceAdjustment = (row) => {
        this.setState({
            itemBalanceAdjustment: row,
            isOpenBalanceAdjustment: true
        })
    }
    onSetBalanceAdjustment = (row, data) => {
        this.setState({ isShowBackdrop: true });

        axiosInstance.put(`${ apiUrls["correct-balance"] }/${ row.wallet._id }`, {
            change: Number(data.amount),
            type: data.type
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

            this.getUsers();
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

    onUserChangePassword = (row, jwt, isSubmit) => {

        if (!isSubmit) {
            this.setState({
                userChangePassword: {
                    row,
                    jwt
                },
            })

            return null
        }

        this.setState({ isShowBackdrop: true });

        axiosInstance.put(apiUrls["user-update-user"], {
            password: row.newPassword
        }, {
            headers: {
                authentication: jwt
            }
        }).then((response) => {

            alertNotification({
                message: "Пароль успешно изменен",
                type: "success"
            })

            this.getUsers();

            this.setState({
                isShowBackdrop: false,
                userChangePassword: {},
            });

        }).catch((error) => {

            alertNotification({
                message: "Ошибка изменения пароля",
                type: "danger"
            })

            this.setState({
                isShowBackdrop: false,
                userChangePassword: {},
            });

        });

    }
    onUserChangeParent = async (user, isEdit, parentUserId) => {
        if (!isEdit) {
            this.setState({
                userChangeParent: user,
            })

            return null
        }

        this.setState({isShowBackdrop: true});

        axiosInstance.put(`${apiUrls["mentor-set"]}/${user._id}`, {
            parentUserId
        }).then((response) => {
            alertNotification({type: "success", message: "Родитель успешно изменен"})
            this.setState({isShowBackdrop: false, userChangeParent: {}});

            this.getUsers();
        });
    }

    onExportUsers = async () => {

        await this.setState({ isShowBackdrop: true });

        const filter = this.getFilter();

        const response = await axiosInstance.get(`${apiUrls["find-users"]}${filter}&export=1`, {
                method: 'GET',
                responseType: 'blob'
            });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users.xlsx');
        document.body.appendChild(link);
        link.click();

        await this.setState({ isShowBackdrop: false });


    }

    render() {
        const {
            users, pagination, filter, isLoading,
            userChangePassword, userChangeParent
        } = this.state;

        return (
            <>

                <Box mb={4}>
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <Typography variant="h1">Пользователи</Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Выгрузить XLS">
                                <Button onClick={this.onExportUsers}>
                                    <ExcelIcon/>
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={5}>
                    <Filter
                        filter={filter}

                        onSearch={this.getUsers}
                        onChange={this.onChangeFilter}
                    />
                </Box>

                <Box>

                    <Table
                        rows={users}
                        filter={filter}
                        pagination={pagination}
                        totalCountRows={this.state.totalCountRows}

                        isLoading={isLoading}

                        onChangeFilter={this.onChangeFilter}
                        onOpenBalanceAdjustment={this.onOpenBalanceAdjustment}
                        onSetUserAdmin={this.onSetUserAdmin}
                        onSetUserGuest={this.onSetUserGuest}
                        onUserChangePassword={this.onUserChangePassword}
                        onChangeParent={this.onUserChangeParent}
                    />

                </Box>

                <BalanceAdjustment
                    item={this.state.itemBalanceAdjustment}

                    isOpen={this.state.isOpenBalanceAdjustment}

                    onSubmit={this.onSetBalanceAdjustment}
                    onClose={() => this.setState({ isOpenBalanceAdjustment: false })}
                />

                <DialogChangePassword
                    user={userChangePassword}
                    isOpen={Object.keys(userChangePassword).length > 0}
                    onSubmit={this.onUserChangePassword}
                    onClose={() => this.setState({userChangePassword: {}})}
                />

                <DialogChangeParent
                    isOpen={Boolean(Object.keys(userChangeParent).length > 0)}
                    onClose={() => this.setState({userChangeParent: {}})}
                    onChange={(userId) => this.onUserChangeParent(userChangeParent, true, userId)}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default Users
