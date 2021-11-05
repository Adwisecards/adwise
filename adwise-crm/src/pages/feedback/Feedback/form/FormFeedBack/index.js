import React, { useState, useRef } from "react";
import {
    Box,
    Grid,
    Button,
    Tooltip,
    TextField,
    Typography
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    X as XIcon
} from "react-feather";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const FormFeedBack = (props) => {
    const { onSubmit } = props;

    const [comment, setComment] = useState('');
    const [files, setFiles] = useState([]);

    const refImageUpload = useRef();

    const classes = useStyles();

    const onChangeComment = ({ target }) => {
        const { value } = target;
        setComment(value);
    }
    const setValues = ({ target }) => {
        const targetFiles = target.files;
        let listFiles = [...files];

        Object.keys(targetFiles).map((key) => {
            listFiles.push(targetFiles[key]);
        });

        setFiles(listFiles);

        refImageUpload.current.value = null;
    }
    const deleteFile = (idx) => {
        let newFiles = [...files];

        newFiles.splice(idx, 1);

        setFiles(newFiles)
    }
    const sendForm = () => {
        let formData = new FormData();

        formData.append('comment', comment);

        files.map((file, idx) => {
            formData.append(`files`, file);
        });

        onSubmit(formData, clearForm);
    }

    const clearForm = () => {
        setFiles([]);
        setComment('');
    }

    return (
        <Box>

            <Box mb={4}>

                <Box mb={1}>
                    <Typography variant="formTitle">{allTranslations(localization.feedbackFormDescription)}</Typography>
                </Box>

                <Box>

                    <TextField
                        value={comment}
                        variant="outlined"
                        multiline
                        rows={5}
                        rowsMax={7}
                        fullWidth

                        placeholder={allTranslations(localization.feedbackFormDescriptionPlaceholder)}

                        onChange={onChangeComment}
                    />

                </Box>

            </Box>

            <Box mb={4}>

                <Box mb={2}>
                    <Typography variant="formTitle">{allTranslations(localization.feedbackFormFiles)}</Typography>
                </Box>

                {
                    (Boolean(files && files.length > 0) && (
                        <Box mb={2}>
                            <Grid container spacing={1}>
                                {
                                    files.map((file, idx) => {
                                        return (
                                            <Grid item>
                                                <Box className={classes.file}>
                                                    <Typography className={classes.fileName}>{ file.name }</Typography>

                                                    <Tooltip arrow title={allTranslations(localization.commonDelete)}>
                                                        <Button className={classes.fileButtonRemove} onClick={() => deleteFile(idx)}>
                                                            <XIcon size={20}/>
                                                        </Button>
                                                    </Tooltip>
                                                </Box>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Box>
                    ))
                }

                <Box>
                    <label>

                        <Tooltip arrow title={allTranslations(localization.feedbackFormUploadDocument)}>
                            <Button variant="outlined" className={classes.buttonUploadFile} component="span">{allTranslations(localization.feedbackFormUploadDocument)}</Button>
                        </Tooltip>

                        <input
                            ref={refImageUpload}

                            type="file"
                            multiple
                            maxLength={10}
                            accept=".doc, .docx, .pdf, image/x-png,image/gif,image/jpeg"

                            style={{opacity: 0, width: 0, height: 0}}

                            onChange={setValues}
                        />

                    </label>
                </Box>

            </Box>

            <Box>
                <Button
                    variant="contained"
                    className={classes.buttonSend}
                    disabled={!comment}
                    onClick={sendForm}
                >{allTranslations(localization.commonSend)}</Button>
            </Box>
        </Box>
    )
};

const useStyles = makeStyles((theme) => ({
    root: {},

    file: {
        border: '1px solid rgba(168, 171, 184, 0.6)',
        borderRadius: 6,
        padding: '10px 12px',

        display: 'flex',
        alignItems: 'center'
    },
    fileName: {
        fontSize: 14,
        lineHeight: '17px'
    },
    fileButtonRemove: {
        padding: 0,
        width: 20,
        minWidth: 20,
        height: 20,
        marginLeft: 8
    },

    buttonUploadFile: {
        fontSize: 16,
        fontWeight: 'normal',
        textTransform: 'initial',
        padding: '0px 24px'
    },
    buttonSend: {
        fontSize: 18,
        fontWeight: '500',
        textTransform: 'initial',
        padding: '4px 24px'
    },
}));

export default FormFeedBack
