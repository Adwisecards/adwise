import React, { useState, useEffect } from "react";
import {
    Box,

    Grid,

    TextField,

    Typography,

    Button, CircularProgress, Backdrop
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import axiosInstance from "../../../../../../agent/agent";
import urls from "../../../../../constants/urls";
import {compose} from "recompose";
import {connect} from "react-redux";
import getErrorMessage from "../../../../../helper/getErrorMessage";
import {store} from "react-notifications-component";


const InviteManager = (props) => {
    const classes = useStyles();

    return (
        <></>
    )
}

const  useStyles = makeStyles((theme) => ({

}));

export default compose(
    connect(
        state => ({
            organization: state.app.organization
        })
    ),
)(InviteManager);
