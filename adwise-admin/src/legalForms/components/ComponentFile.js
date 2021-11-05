import React, {useRef} from "react";
import {
    Typography,

    TextField, Button, Box, Tooltip, IconButton
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {FileText as FileTextIcon, X as XIcon} from "react-feather";

const ComponentInput = (props) => {
    const { title, name, value, placeholder, hint, fileProps, onChange } = props;
    const classes = useStyles();

    const refInputFile = useRef();

    const handleOnChangeFile = ({ target }) => {
        const { name, files } = target;

        refInputFile.current.values = null;

        onChange({target})
    }

    return (
        <>

            <Typography className={classes.title}>{ title }</Typography>

            <label>

                <Button variant="outlined" component="span" size="small" fullWidth>Загрузить документы</Button>

                <input
                    ref={refInputFile}

                    type="file"
                    name={name}
                    multiple={fileProps.multiple || false}
                    accept={fileProps.accept || ""}

                    style={{opacity: 0, width: 0, height: 0}}

                    onChange={handleOnChangeFile}
                />

            </label>

            { ( !!hint ) && (<Typography className={classes.caption}>{ hint }</Typography>) }

            <DownloadFiles
                files={value}
                classes={classes}

                onDeleteFile={null}
            />

        </>
    )
};

const DownloadFiles = (props) => {
    const { files, onDeleteFile } = props;

    const classes = useStyles();

    if (!files || Object.keys(files).length <= 0) {
        return null
    }

    const handleOnDelete = (key) => {
        let newFiles = {...files};

        newFiles[key] = null;

        console.log('files: ', files);
    }

    return (
        <>

            {

                Object.keys(files).map((key, idx) => {
                    const file = files[key];

                    return (
                        <Box className={classes.activeFile} mt={2} mb={2}>
                            <FileTextIcon/>

                            <span style={{ overflowWrap: 'anywhere' }}>{file.name}</span>

                            <Tooltip title="Удалить">
                                <IconButton
                                    style={{marginLeft: 16, justifyContent: 'center', alignItems: 'center'}}
                                    onClick={() => handleOnDelete(key)}
                                >
                                    <XIcon color="#8152E4" style={{width: 16}}/>
                                </IconButton>
                            </Tooltip>

                        </Box>
                    )
                })

            }

        </>
    )
};

const useStyles = makeStyles((theme) => ({
    title: {

        fontSize: 14,
        lineHeight: '17px',
        color: '#999DB1',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: 4

    },

    input: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: '19px',
        color: '#25233E'
    },

    caption: {
        fontSize: 10,
        lineHeight: '12px',
        color: '#999DB1',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginTop: 4
    },

    activeFile: {

        display: 'flex',
        alignItems: 'center',

        width: "fit-content",

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(168, 171, 184, 0.6)',
        borderRadius: 5,

        backgroundColor: 'white',

        maxWidth: '100%',

        padding: '8px 16px',

        fontFamily: 'Atyp Display',
        fontSize: 16,
        lineHeight: '19px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        '& svg': {
            color: '#ED8E00',
            marginRight: 8
        }
    }
}));

export default ComponentInput
