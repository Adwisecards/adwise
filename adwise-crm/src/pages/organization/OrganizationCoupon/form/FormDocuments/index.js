import React from "react";
import {
    Box,

    Typography,

    Button
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    FileText as FileTextIcon
} from "react-feather";
import {getMediaUrl} from "../../../../../common/media";

const FormDocuments = (props) => {
    const {documents} = props;
    const classes = useStyles();

    const openDocument = (document) => {

        const link = getMediaUrl(document.documentMedia);

        window.open(link);

    }

    const _titleDocument = (document) => {
        if (document.type === 'terms') {
            return "Условия проведения акции"
        }

        return "Без названия"
    }

    return (
        <>

            {

                documents.map((document) => (
                    <Box mb={5}>

                        <Typography className={classes.title}>{ _titleDocument(document) }</Typography>

                        <Button onClick={() => openDocument(document)} className={classes.activeFile} mt={2} mb={2}>
                            <FileTextIcon/>
                            Открыть
                        </Button>

                    </Box>
                ))

            }

        </>
    )
}

const useStyles = makeStyles((theme) => ({

    title: {
        fontSize: 16,
        lineHeight: '19px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: theme.spacing(1)
    },
    description: {
        fontSize: 14,
        lineHeight: '17px',
        letterSpacing: '0.02em',
        color: '#9FA3B7',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: theme.spacing(3)
    },

    input: {
        display: 'none',
        opacity: 0,
        width: 0,
        height: 0
    },

    activeFile: {

        display: 'flex',
        alignItems: 'center',

        width: "fit-content",

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(168, 171, 184, 0.6)',
        borderRadius: 5,

        padding: '8px 16px',

        fontFamily: 'Atyp Display',
        fontSize: 16,
        lineHeight: '19px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        '& svg': {
            color: '#ED8E00',
            marginRight: theme.spacing(1)
        }
    }

}));

export default FormDocuments
