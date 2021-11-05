import React from "react";
import {
    Box,
    Grid,
    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    HelpBadge
} from "../../../../../components";

const InfoCard = (props) => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                    <Typography className={classes.title} dangerouslySetInnerHTML={{ __html: props.title }}/>
                </Grid>
                <Grid item>
                    <HelpBadge tooltip={props.tooltip}/>
                </Grid>
            </Grid>
            <Typography className={classes.value} dangerouslySetInnerHTML={{ __html: props.value }}/>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {},

    title: {
        fontSize: 13,
        lineHeight: '17px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    value: {
        marginTop: 12,

        fontSize: 20,
        lineHeight: '24px',
        fontWeight: '500',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        color: '#8152E4',

        [theme.breakpoints.between(0, 1649)]: {
            fontSize: 21,
        },
    },

    caption: {
        marginTop: 4,

        fontSize: 12,
        lineHeight: '14px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        color: '#C4A2FC',
        opacity: 0.7
    }
}));

export default InfoCard
