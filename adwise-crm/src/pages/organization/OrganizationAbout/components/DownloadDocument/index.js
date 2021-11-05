import React from "react";
import {
    Button,
    Tooltip,
    Typography,
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    FileText as FileTextIcon
} from "react-feather";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const nameDocuments = {
    "individual": allTranslations(localization.documentTypesIndividual),
    "ip": allTranslations(localization.documentTypesIp),
    "ooo": allTranslations(localization.documentTypesOoo),
};

const DownloadDocument = (props) => {
    const { title, onClick, legalForm } = props;
    const classes = useStyles();

    return (
        <Tooltip arrow title={`${allTranslations(localization.organizationAboutButtonsDownloadQuestionnaire)} ${ nameDocuments[legalForm] }`}>

            <Button className={classes.card} onClick={onClick}>

                <div className={classes.icon}>

                    <FileTextIcon color="#ED8E00" size={32} className={classes.icon}/>

                </div>

                <Typography variant="h4" gutterBottom>
                    {title} <span style={{ textTransform: "uppercase" }}>{ nameDocuments[legalForm] }</span>
                </Typography>

            </Button>

        </Tooltip>
    )
};

const useStyles = makeStyles((theme) => ({

    card: {

        border: '1px solid #cbccd4',
        borderRadius: '5px',
        background: 'white',
        padding: '16px 22px',
        marginBottom: '12px',
        justifyContent: 'left',
        textAlign: 'left',
        textTransform: 'none'

    },

    icon: {
        marginRight: 8,
        minWidth: 32
    },

}));

export default DownloadDocument
