import React, { useState, useEffect } from 'react';
import {
    Box,

    Grid,

    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import Page from '../Page';
import clsx from "clsx";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const LoadingStartSystem = (props) => {

    const [isStartLoading, setStartLoading] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setStartLoading(true);
        }, 1000);
    }, []);

    const classes = useStyles();
    const isDemo = process.env.REACT_APP_DEMO === "true";

    return (
        <Page>
            <Grid container justify={'center'} alignItems={'center'} style={{ minHeight: '98vh', flexDirection: "column" }}>
                <Grid item>
                    <img src="/source/svg/people/people-login.svg"/>
                </Grid>

                {
                    isDemo && (
                        <>
                            <Box mt={4}>
                                <Typography style={{textAlign: "center"}} variant="h4">
                                    {allTranslations(localization['loadingStartSystem.title'])}
                                </Typography>
                            </Box>
                            <Box mt={2}>
                                <div className={clsx({
                                    [classes.linearProgress]: true,
                                    [classes.linearProgressActive]: isStartLoading
                                })}/>
                            </Box>
                        </>
                    )
                }
            </Grid>
        </Page>
    )
}

const useStyles = makeStyles((theme) => ({
    linearProgress: {
        width: 400,
        height: 5,
        borderRadius: 25,
        backgroundColor: "#eee4ff",
        position: "relative",
        overflow: "hidden",

        '&:after': {
            content: "''",
            position: "absolute",
            width: 0,
            left: 0,
            top: 0,
            bottom: 0,
            transition: "all 80s",
            backgroundColor: "#8152E4"
        }
    },
    linearProgressActive: {
        '&:after': {
            width: 400
        }
    },
}));

export default LoadingStartSystem
