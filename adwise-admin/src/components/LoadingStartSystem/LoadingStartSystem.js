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

const LoadingStartSystem = (props) => {

    return (
        <Page>
            <Grid container justify={'center'} alignItems={'center'} style={{ minHeight: '100vh' }}>
                <Grid item>
                    <img src="/source/svg/people/people-login.svg"/>
                </Grid>
            </Grid>
        </Page>
    )
}

export default LoadingStartSystem
