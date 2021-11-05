import React from "react";
import {
    Box,
    Button,
    Typography
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const CardType = (props) => {
    const { title, message, Icon, onClick } = props;

    const classes = useStyles();

    return (
        <Box className={classes.card}>
            <Typography className={classes.title}>{ title }</Typography>
            <Typography className={classes.message}>{ message }</Typography>

            <Button className={classes.button} variant="contained" onClick={onClick}>{allTranslations(localization.profileSelectionButtonsEntryType)}</Button>

            <Box className={classes.cardIconContainer}>
                <Icon/>
            </Box>
        </Box>
    )
};

const useStyles = makeStyles((theme) => ({
    card: {
        padding: 56,

        borderRadius: 12,

        position: 'relative',

        backgroundColor: 'white'
    },

    title: {
        fontSize: 32,
        lineHeight: '38px',
        fontWeight: '500',
        fontFeatureSettings: "'ss03' on",

        marginBottom: 16
    },
    message: {
        maxWidth: 280,
        marginBottom: 32,

        fontSize: 14,
        lineHeight: '17px',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    cardIconContainer: {
        position: 'absolute',
        right: 60,
        bottom: 0,

        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },

    button: {
        padding: '6px 24px',
        fontSize: 18,
        lineHeight: '36px',
        textTransform: 'none'
    },
}));

export default CardType
