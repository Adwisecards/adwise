import React from "react";
import {
    Box,
    Grid,
    Typography
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {formatMoney} from "../../../../../helper/format";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";


const Statistics = (props) => {
    const { statistics } = props;

    const classes = useStyles();

    return (
        <Box className={classes.root}>

            <Typography className={classes.title}>{allTranslations(localization.clientsStatsTitle)}</Typography>

            <Box className={classes.item}>
                <Typography className={classes.itemTitle}>{allTranslations(localization.clientsStatsAllClients)}</Typography>
                <Typography className={classes.itemValue}>{ formatMoney(statistics.clientCount) }</Typography>
            </Box>

            <div className={classes.separate}/>

            <Box className={classes.item}>
                <Typography className={classes.itemTitle}>{allTranslations(localization.clientsStatsPayments)}, ₽</Typography>
                <Typography className={classes.itemValue}>{ formatMoney(statistics.purchaseSum, 2, '.') }</Typography>
            </Box>

            <div className={classes.separate}/>

            <Box className={classes.item}>
                <Typography className={classes.itemTitle}>{allTranslations(localization.clientsStatsCountPaymentsPurchase)}</Typography>
                <Typography className={classes.itemValue}>{ formatMoney(statistics.purchaserCount) }</Typography>
            </Box>

        </Box>
    )
};

const useStyles = makeStyles(() => ({
    root: {
        position: 'sticky',
        top: 0,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(168, 171, 184, 0.6)',
        borderRadius: 8,

        padding: 32,
        marginTop: 41,

        width: '100%'
    },

    title: {
        fontSize: 20,
        fontWeight: '500',
        lineHeight: '24px',
        color: '#25233E',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: 32
    },

    item: {},
    itemTitle: {
        fontSize: 15,
        lineHeight: '18px',
        color: '#999DB1',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: 6
    },
    itemValue: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: '22px',
        color: '#25233E',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    separate: {
        width: '100%',
        height: 1,
        backgroundColor: '#CBCCD4',
        opacity: 0.5,
        margin: '16px 0'
    }
}));

export default Statistics
