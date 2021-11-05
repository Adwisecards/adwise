import React, { Component } from "react";
import {
    Box,
    Grid,
    Typography,
    Button,
    Tooltip,
    Tabs,
    Tab, CircularProgress, Backdrop
} from "@material-ui/core";
import {
    Table,
    CreateDocument,
    EditDocument
} from "./components";
import {Plus as PlusIcon} from "react-feather";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import alertNotification from "../../../common/alertNotification";
import {getMediaFile, getMediaId} from "../../../common/media";

class Documents extends Component {
    constructor(props) {
        super(props);

        this.state = {
            documents: [],

            deleteDocument: {},
            editDocument: {},

            type: "crm",

            isLoading: true,
            isUseWiseDefault: false,
            isShowBackdrop: false,
            isOpenDocument: false,
            isOpenConfirmDelete: false,
        };
    }

    componentDidMount = () => {
        this.getListDocuments();
    }

    getListDocuments = () => {
        this.setState({ isLoading: true });

        axiosInstance.get(`${ apiUrls["document-get"] }/${this.state.type}`).then((response) => {
            const documents = response.data.data.documents;

           this.setState({
               isLoading: false,
               documents: documents,
           });
        });
    }

    onOpenModalCreateDocument = () => {
        this.setState({ isOpenDocument: true })
    }

    onCreateDocument = async (form) => {
        this.setState({isShowBackdrop: true});

        let body = {...form};
        body.fileMediaId = await getMediaId(form.document);
        delete form.document;

        axiosInstance.post(apiUrls["add-document"], body).then((response) => {
            this.setState({
                isShowBackdrop: false,
                isOpenDocument: false
            });

            alertNotification({
                title: "Уведомление системы",
                message: "Документ успешно создан",
                type: "success"
            });

            this.getListDocuments();
        }).catch((error) => {
            this.setState({ isShowBackdrop: false });

            alertNotification({
                title: "Уведомление системы",
                message: "Ошибка создания документа",
                type: "danger"
            })
        });

        this.setState({isShowBackdrop: false});

        this.getListDocuments();
    }
    onDeleteDocument = async (document) => {
        this.setState({isShowBackdrop: true});

        const response = await axiosInstance.delete(`${apiUrls['document-delete']}/${document._id}`);

        await this.getListDocuments();

        this.setState({isShowBackdrop: false});
    }
    onEditDocument = async (document, isEdit) => {
        if (!isEdit) {
            let initialForm = {
                _id: document._id,
                name: document.name,
                type: document.type,
                description: document.description,
                fileMediaId: document.file,
                disabled: false
            }

            this.setState({editDocument: initialForm});

            return null
        }

        this.setState({ isShowBackdrop: true });

        if (document.document) {
            document.fileMediaId = await getMediaId(document.document);
            delete document.document;
        }
        await axiosInstance.put(`${apiUrls['document-update']}/${document._id}`, document);

        await this.getListDocuments();

        this.setState({ isShowBackdrop: false, editDocument: {} });
    }

    onChangeType = (event, type) => {
        this.setState({type}, () => {
           this.getListDocuments();
        });
    }

    render() {
        const { documents, isLoading } = this.state;

        return (
            <>

                <Box mb={4}>
                    <Grid container spacing={2} justify="space-between">

                        <Grid item>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Typography variant="h1">Документы</Typography>
                                </Grid>
                                <Grid item>
                                    <Tabs value={this.state.type} onChange={this.onChangeType}>
                                        <Tab value="crm" label="CRM/WEB"/>
                                        <Tab value="business" label="AdWise Business"/>
                                        <Tab value="cards" label="AdWise Cards"/>
                                    </Tabs>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Tooltip title="Создать документ">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    style={{padding: 10, minWidth: 0}}

                                    onClick={this.onOpenModalCreateDocument}
                                >
                                    <PlusIcon/>
                                </Button>
                            </Tooltip>
                        </Grid>

                    </Grid>
                </Box>

                <Box>
                    <Table
                        rows={documents}

                        isLoading={isLoading}

                        onDelete={this.onDeleteDocument}
                        onEdit={this.onEditDocument}
                    />
                </Box>

                <CreateDocument
                    isOpen={this.state.isOpenDocument}
                    onCreate={this.onCreateDocument}
                    onClose={() => this.setState({isOpenDocument: false})}
                />

                <EditDocument
                    isOpen={Object.keys(this.state.editDocument).length > 0}
                    initialForm={this.state.editDocument}
                    onCreate={(form) => this.onEditDocument(form, true)}
                    onClose={() => this.setState({editDocument: {}})}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default Documents
