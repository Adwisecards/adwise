import React, { Component } from "react";
import {
    Box, Button,
    Grid, Tooltip,
    Typography
} from "@material-ui/core";
import {
    Table,
    CreateTask,
    ModalDeleteConfirm
} from "./components";
import {store} from "react-notifications-component";
import {Plus as PlusIcon} from "react-feather";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import alertNotification from "../../../common/alertNotification";

class Tasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: [],

            deleteTask: {},

            isLoading: true,
            isUseWiseDefault: false,
            isShowBackdrop: false,
            isOpenTask: false,
            isOpenConfirmDelete: false,
        };
    }

    componentDidMount = () => {
        this.getListTasks();
    }

    getListTasks = () => {
        this.setState({ isLoading: true });

        axiosInstance.get(`${ apiUrls["get-global"] }`).then((response) => {
            const tasks = response.data.data.global.tasks;

           this.setState({
               tasks,
               isLoading: false
           })
        });
    }

    onOpenModalCreateTask = () => {
        this.setState({ isOpenTask: true });
    }

    onDeleteTask = () => {}

    onCreateTask = (form) => {
        this.setState({ isShowBackdrop: true });

        axiosInstance.put(`${ apiUrls["add-task"] }`, form).then((response) => {
            this.setState({
                isShowBackdrop: false,
                isOpenTask: false,
            });

            this.getListTasks();

            alertNotification({
                title: "Системное уведомление",
                message: "Задача успешно создана",
                type: "success"
            })
        }).catch((error) => {
            this.setState({
                isShowBackdrop: false
            });

            alertNotification({
                title: 'Системное уведомление',
                message: 'Ошибка создания задачи',
                type: 'danger'
            })
        })
        console.log('form: ', form);
    }

    onChangeActiveTask = (task) => {}

    render() {
        const { tasks, isLoading } = this.state;

        return (
            <>

                <Box mb={4}>
                    <Grid container spacing={2} justify="space-between">

                        <Grid item>
                            <Typography variant="h1">Задачи</Typography>
                        </Grid>

                        <Grid item>
                            <Tooltip title="Создать задачу">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    style={{padding: 10, minWidth: 0}}

                                    onClick={this.onOpenModalCreateTask}
                                >
                                    <PlusIcon/>
                                </Button>
                            </Tooltip>
                        </Grid>

                    </Grid>
                </Box>

                <Box>
                    <Table
                        rows={tasks}

                        isLoading={isLoading}

                        onDelete={this.onDeleteTask}
                        onChangeActiveTask={this.onChangeActiveTask}
                    />
                </Box>

                <CreateTask
                    isOpen={this.state.isOpenTask}
                    onCreateTask={this.onCreateTask}
                    onClose={() => this.setState({isOpenTask: false})}
                />

            </>
        );
    }
}

export default Tasks
