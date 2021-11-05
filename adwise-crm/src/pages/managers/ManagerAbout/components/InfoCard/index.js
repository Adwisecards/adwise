import React from "react";
import {
    Box,

    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';

const InfoCard = ({title, value, caption}) => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Typography className={classes.title} dangerouslySetInnerHTML={{ __html: title }}/>
            <Typography className={classes.value} dangerouslySetInnerHTML={{ __html: value }}/>

            {(!!caption) && ( <Typography className={classes.caption} dangerouslySetInnerHTML={{ __html: caption }}/> )}
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {},

    title: {
        fontSize: 13,
        lineHeight: '15px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    value: {
        marginTop: 16,

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