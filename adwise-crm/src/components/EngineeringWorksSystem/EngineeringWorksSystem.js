import React from 'react';
import {
    Box,

    Grid,

    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import Page from '../Page';
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const EngineeringWorksSystem = (props) => {

    return (
        <Page>

            <Box p={4} minHeight="100vh" alignItems="center" justifyContent="center" display="flex" flexDirection="column">

                <Box mb={4}>
                    <Typography variant="h1">{allTranslations(localization['engineeringWorksSystem.title'])}</Typography>
                </Box>

                <img src="/source/svg/people/people-login.svg"/>

            </Box>

        </Page>
    )
}

export default EngineeringWorksSystem
