import React, {Component} from "react";
import {
    Box,
    Grid,
    Typography,
    FormControl,
    Select,
    IconButton, Button, Tooltip, CircularProgress, Backdrop
} from "@material-ui/core";
import {
    RefreshCw as RefreshCwIcon
} from "react-feather";

import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import axiosInstanceReplica from "../../../agent/agentReplica";

const sectionsName = {
    prod: "replica",
    replica: "prod",
};

class SystemLogging extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],

            file: null,

            loggings: "",

            isLoadLoggings: false,
            isShowBackdrop: false,
        };
    }

    componentDidMount = async () => {
        await this.getFiles();
    }

    getFiles = async () => {
        const files = await axiosInstance.get(apiUrls["get-system-log-filenames"]).then((response) => {
            return response.data.data.systemLogFilenames
        })
        const filesReplica = await axiosInstanceReplica.get(apiUrls["get-system-log-filenames"]).then((response) => {
            return response.data.data.systemLogFilenames
        })

        let filesList = {
            prod: files,
            replica: filesReplica
        }

        this.setState({
            files: filesList
        })
    }
    getLoggings = async () => {
        this.setState({isShowBackdrop: true});

        let log = await axiosInstance.get(`${apiUrls["get-system-log-file"]}/${this.state.file.split('|-|-|').pop()}`).then((response) => {
            return response.data.data.systemLogFile
        })

        let loggings = log.replace(/"}/gi, '"<br/>}<br/><br/>');
        loggings = loggings.replace(/{"/gi, '{<br/>"');
        loggings = loggings.replace(/","/gi, '",<br/>"');
        loggings = loggings.replace(/"} {"/gi, '"}<br/>{"');

        this.setState({
            loggings,
            isShowBackdrop: false
        })
    }
    getLoggingsReplice = async () => {
        this.setState({isShowBackdrop: true});

        let log = await axiosInstanceReplica.get(`${apiUrls["get-system-log-file"]}/${this.state.file.split('|-|-|').pop()}`).then((response) => {
            return response.data.data.systemLogFile
        })

        let loggings = log.replace(/"}/gi, '"<br/>}<br/><br/>');
        loggings = loggings.replace(/{"/gi, '{<br/>"');
        loggings = loggings.replace(/","/gi, '",<br/>"');
        loggings = loggings.replace(/"} {"/gi, '"}<br/>{"');

        this.setState({
            loggings,
            isShowBackdrop: false
        })
    }

    onUpdate = async () => {
        let split = this.state.file.split('|-|-|');
        if (split[0] === 'prod'){
            await this.getLoggings();
        }
        if (split[0] === 'replica'){
            await this.getLoggingsReplice();
        }
    }

    onChangeFile = ({target}) => {
        const { value } = target;

        this.setState({file: value}, async () => {
            let split = value.split('|-|-|');
            if (split[0] === 'prod'){
                await this.getLoggings();
            }
            if (split[0] === 'replica'){
                await this.getLoggingsReplice();
            }
        });
    }

    render() {
        const {file, files, loggings, isLoadLoggings} = this.state;

        return (
            <>
                <Box mb={2}>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="h1">Системные логи</Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Обновить">
                                <Button
                                    variant="contained"
                                    style={{padding: 0,minWidth: 0,width: 40,height: 40}}
                                    onClick={this.onUpdate}
                                    disabled={!file}
                                >
                                    <RefreshCwIcon color="white" size={20}/>
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Typography>Выберите файл логирования</Typography>
                            <FormControl fullWidth margin="normal">
                                <Select
                                    native
                                    fullWidth
                                    variant="outlined"
                                    value={file}
                                    onChange={this.onChangeFile}
                                >
                                    <option value="">Выберите</option>
                                    {
                                        Object.keys(files).map((key) => {
                                            const items = files[key];
                                            return (
                                                <optgroup label={sectionsName[key]}>
                                                    {
                                                        items.map((fileName) => (
                                                            <option value={`${key}|-|-|${fileName}`}>{fileName}</option>
                                                        ))
                                                    }
                                                </optgroup>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>

                <Box overflow="auto">

                    {
                        isLoadLoggings && (
                            <Typography variant="h4">Идет загрузка... Ожидайте</Typography>
                        )
                    }

                    {
                        !isLoadLoggings && (
                            <Typography
                                dangerouslySetInnerHTML={{__html: loggings}}
                                style={{
                                    fontSize: 18,
                                    lineHeight: '26px',
                                    fontWeight: '300'
                                }}
                            />
                        )
                    }

                    <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                        <CircularProgress size={80} style={{color: 'white'}}/>
                    </Backdrop>

                </Box>
            </>
        );
    }
}

export default SystemLogging
