import React, {Component} from "react";
import {
    Box,
    Grid,
    Button,
    Tooltip,
    Backdrop,
    IconButton,
    Typography,
    CircularProgress
} from "@material-ui/core";
import {
    Table as TableComponent,
    DialogEdit as DialogEditComponent,
    DialogCreated as DialogCreatedComponent
} from "./components";
import {
    Plus as PlusIcon
} from "react-feather";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import alertNotification from "../../../common/alertNotification";

class Advantage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [],

            edited: {},

            isLoading: true,
            isOpenCreated: false,
            isShowBackdrop: false
        };
    }

    componentDidMount = () => {
        this.getAdvantage();
    }

    getAdvantage = () => {
        this.setState({isLoading: true});

        axiosInstance.get(apiUrls["advantage-get"]).then((response) => {
            this.setState({
                rows: response.data.data.advantages,
                isLoading: false
            })
        });
    }

    createAdvantage = async (form) => {
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

        axiosInstance.post(apiUrls["advantage-create"], {
            name: form.name,
            index: form.index,
            pictureMediaId: fileId
        }).then((res) => {
            this.setState({isShowBackdrop: false, isOpenCreated: false});
            this.getAdvantage();
        })
    }
    editAdvantage = async (form, isEdit) => {
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

        axiosInstance.put(`${apiUrls["advantage-update"]}/${form._id}`, {
            name: form.name,
            index: form.index,
            pictureMediaId: fileId
        }).then((res) => {
            this.setState({isShowBackdrop: false, edited: {}});
            this.getAdvantage();
        })
    }
    deleteAdvantage = (id) => {
        this.setState({isShowBackdrop: true});
        axiosInstance.delete(`${apiUrls["advantage-delete"]}/${id}`).then(() => {
            this.setState({isShowBackdrop: false});
            this.getAdvantage();
        });
    }

    render() {
        const {
            rows,
            edited,
            isLoading,
            isOpenCreated
        } = this.state;

        return (
            <>

                <Box mb={3}>
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <Typography variant="h1">Преимущество</Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Добавить преимущество">
                                <IconButton onClick={() => this.setState({isOpenCreated: true})}>
                                    <PlusIcon color="#8152E4"/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Box>

                <TableComponent
                    rows={rows}
                    isLoading={isLoading}
                    onEdit={this.editAdvantage}
                    onDelete={this.deleteAdvantage}
                />

                <DialogCreatedComponent
                    isOpen={isOpenCreated}
                    onClose={() => this.setState({isOpenCreated: false})}
                    onCreate={this.createAdvantage}
                />

                <DialogEditComponent
                    initialForm={edited}
                    isOpen={Boolean(Object.keys(edited).length > 0)}
                    onClose={() => this.setState({edited: {}})}
                    onEdit={this.editAdvantage}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default Advantage
