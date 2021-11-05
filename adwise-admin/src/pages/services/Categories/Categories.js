import React, {Component} from "react";
import {
    Backdrop,

    Box,

    Grid,

    CircularProgress,

    Typography,

    Button,
    Tooltip
} from "@material-ui/core";
import {
    Table,
    CategoryCreated,
    ModalDeleteConfirm
} from "./components";
import {
    Plus as PlusIcon
} from "react-feather";

import {store} from "react-notifications-component";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";

class Categories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],

            deleteCategory: {},

            isLoading: true,
            isShowBackdrop: false,
            isOpenCreating: false,
            isOpenConfirmDelete: false,
        };
    }

    componentDidMount = () => {
        this.getCategories();
    }

    getCategories = () => {
        axiosInstance.get(apiUrls["get-categories"]).then((response) => {
            this.setState({
                categories: response.data.data.categories,

                isLoading: false
            })
        });
    }

    onDeleteCategory = (deleteCategory, isConfirm = false) => {


        if (!isConfirm) {
            this.setState({
                deleteCategory,
                isOpenConfirmDelete: true
            });

            return null
        }

        this.setState({isShowBackdrop: true});

        axiosInstance.delete(`${apiUrls["delete-category"]}/${deleteCategory._id}`).then((response) => {
            this.getCategories();

            this.setState({
                isShowBackdrop: false,
                isOpenConfirmDelete: false
            });

            store.addNotification({
                title: 'Системное уведомление',
                message: 'Категория успешно удалена',
                type: 'success',
                insert: 'top',
                container: 'bottom-left',
                dismiss: {
                    duration: 5000,
                    onScreen: false,
                    pauseOnHover: true,
                    delay: 0
                }
            });
        }).catch((error) => {
            this.setState({isShowBackdrop: false});

            store.addNotification({
                title: 'Ошибка',
                message: 'Произошла ошибки при удалени',
                type: 'danger',
                insert: 'top',
                container: 'bottom-left',
                dismiss: {
                    duration: 5000,
                    onScreen: false,
                    pauseOnHover: true,
                    delay: 0
                }
            });
        });
    }

    onOpenModalCreateCategory = () => {
        this.setState({isOpenCreating: true});
    }
    onCreateCategory = (form) => {
        this.setState({ isShowBackdrop: true });

        axiosInstance.post(apiUrls["create-category"], form).then((response) => {
            this.getCategories();

            this.setState({
                isShowBackdrop: false,
                isOpenCreating: false
            });

            store.addNotification({
                title: 'Системное уведомление',
                message: 'Категория успешно добавлена',
                type: 'success',
                insert: 'top',
                container: 'bottom-left',
                dismiss: {
                    duration: 5000,
                    onScreen: false,
                    pauseOnHover: true,
                    delay: 0
                }
            });
        }).catch((error) => {
            this.setState({isShowBackdrop: false});

            store.addNotification({
                title: 'Ошибка',
                message: 'Произошла ошибки при создании',
                type: 'danger',
                insert: 'top',
                container: 'bottom-left',
                dismiss: {
                    duration: 5000,
                    onScreen: false,
                    pauseOnHover: true,
                    delay: 0
                }
            });
        })
    }

    render() {
        const {categories, isLoading} = this.state;

        return (
            <>

                <Box mb={4}>

                    <Grid container spacing={2} justify="space-between">

                        <Grid item>
                            <Typography variant="h1">Категории</Typography>
                        </Grid>

                        <Grid item>
                            <Tooltip title="Создать категорию">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    style={{padding: 10, minWidth: 0}}

                                    onClick={this.onOpenModalCreateCategory}
                                >
                                    <PlusIcon/>
                                </Button>
                            </Tooltip>
                        </Grid>

                    </Grid>

                </Box>

                <Box>

                    <Table
                        rows={categories}

                        isLoading={isLoading}

                        onDelete={this.onDeleteCategory}
                    />

                </Box>

                <ModalDeleteConfirm
                    item={this.state.deleteCategory}

                    isOpen={this.state.isOpenConfirmDelete}

                    onClose={() => this.setState({isOpenConfirmDelete: false})}
                    onDelete={this.onDeleteCategory}
                />

                <CategoryCreated
                    isOpen={this.state.isOpenCreating}

                    onCreate={this.onCreateCategory}
                    onClose={() => this.setState({isOpenCreating: false})}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default Categories
