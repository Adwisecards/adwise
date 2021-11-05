import React, {Component} from "react";
import {
    Box,
    Grid,
    Button,
    Tooltip,
    IconButton,
    Typography, CircularProgress, Backdrop
} from "@material-ui/core";
import {
    Plus as PlusIcon
} from "react-feather";
import {
    Table as TableComponent,
    DialogEdit as DialogEditComponent,
    DialogCreated as DialogCreatedComponent
} from "./components";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import alertNotification from "../../../common/alertNotification";

class Partner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [],

            edited: {},

            isLoading: true,
            isCreated: false,
            isShowBackdrop: false
        };
    }

    componentDidMount = () => {
        this.getPartners();
    }

    getPartners = () => {
        axiosInstance.get(apiUrls["partner-get"]).then((res) => {
            this.setState({
                rows: res.data.data.partners,
                isLoading: false
            })
        })
    }

    createPartner = async (form) => {
        this.setState({isShowBackdrop: true});

        const formData = new FormData();
        formData.append('data', form.file);
        formData.append('type', 'image');
        const fileId = await axiosInstance.post(apiUrls["media-create"], formData).then((response) => {
            return response.data.data.mediaId
        }).catch((error) => {
            return null
        });

        if (!fileId) {
            this.setState({isShowBackdrop: false});
            alertNotification({
                message: "Не удалось загрузить файл",
                type: "danger"
            })

            return null
        }

        let postForm = {
            index: Number(form.index) || 0,
            name: form.name,
            description: form.description,
            presentationUrl: form.presentationUrl,
            pictureMediaId: fileId
        };
        if (!postForm.presentationUrl) {
            delete postForm.presentationUrl
        }

        axiosInstance.post(apiUrls["partner-create"], postForm).then((res) => {
            this.setState({isShowBackdrop: false, isCreated: false});
            this.getPartners();
        })
    }
    editPartner = async (form, isEdit) => {
        if (!isEdit) {
            this.setState({edited: form})

            return null
        }

        this.setState({isShowBackdrop: true});

        let fileId = form.picture;

        if (form.file) {
            const formData = new FormData();
            formData.append('data', form.file);
            formData.append('type', 'image');
            fileId = await axiosInstance.post(apiUrls["media-create"], formData).then((response) => {
                return response.data.data.mediaId
            }).catch((error) => {
                return null
            });
        }

        if (!fileId) {
            this.setState({isShowBackdrop: false});
            alertNotification({
                message: "Не удалось загрузить файл",
                type: "danger"
            })

            return null
        }

        let formPost = {
            index: Number(form.index) || 0,
            name: form.name,
            description: form.description,
            presentationUrl: form.presentationUrl,
            pictureMediaId: fileId
        };

        if (!formPost.presentationUrl) {
            delete formPost.presentationUrl;
        }

        axiosInstance.put(`${apiUrls["partner-update"]}/${form._id}`, formPost).then((res) => {
            this.setState({isShowBackdrop: false, edited: {}});
            this.getPartners();
        })
    }
    deletePartner = (id) => {
        this.setState({isShowBackdrop: true});
        axiosInstance.delete(`${apiUrls["partner-delete"]}/${id}`).then(() => {
            this.setState({isShowBackdrop: false});
            this.getPartners();
        });
    }

    render() {
        const { edited } = this.state;

        return (
            <>

                <Box mb={3}>
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <Typography variant="h1">Партнеры</Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Добавить">
                                <IconButton onClick={() => this.setState({isCreated: true})}>
                                    <PlusIcon color="#8152E4"/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Box>

                <TableComponent
                    rows={this.state.rows}
                    isLoading={this.state.isLoading}
                    onEdit={this.editPartner}
                    onDelete={this.deletePartner}
                />

                <DialogEditComponent
                    initialForm={edited}
                    isOpen={Boolean(Object.keys(edited).length > 0)}
                    onClose={() => this.setState({edited: {}})}
                    onEdit={this.editPartner}
                />

                <DialogCreatedComponent
                    isOpen={this.state.isCreated}
                    onClose={() => this.setState({isCreated: false})}
                    onCreate={this.createPartner}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default Partner
