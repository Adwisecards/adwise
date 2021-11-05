import React from "react";
import {
    Box,
    Grid,

    Tooltip,

    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    Clock as ClockIcon
} from "react-feather";

import moment from "moment";
import localization from "../../../../../localization/localization";
import allTranslations from "../../../../../localization/allTranslations";

const InfoCard = (props) => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Box>
                <Grid container spacing={1} alignItems="flex-end">
                    <Grid item>
                        <Typography className={classes.title} dangerouslySetInnerHTML={{ __html: props.title }}/>
                    </Grid>

                    {
                        (!!props.updatedAt && false) && (
                            <Grid item>

                            </Grid>
                        )
                    }
                </Grid>
            </Box>
            <Typography className={classes.value} dangerouslySetInnerHTML={{ __html: props.value }}/>

            {
                (props.updatedAt) && (
                    <div className={classes.updatedAt}>
                        <Tooltip arrow title={allTranslations(localization.dashboardLastUpdateTime, {time: moment(props.updatedAt).format("DD.MM.YYYY HH:mm:ss")})}>
                            <ClockIcon color="#8152E4" size={20}/>
                        </Tooltip>
                    </div>
                )
            }

            {(!!props.caption) && ( <Typography className={classes.caption} dangerouslySetInnerHTML={{ __html: props.caption }}/> )}
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative'
    },

    title: {
        fontSize: 15,
        lineHeight: '18px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    value: {
        marginTop: 16,

        fontSize: 26,
        lineHeight: '31px',
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
    },

    updatedAt: {
        position: 'absolute',
        right: -6,
        top: -6,
        opacity: 0.3
    }
}));

export default InfoCard
