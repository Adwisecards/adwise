import React, { useState, useRef } from "react";
import {
    Box,
    Grid, TextField,
    Typography,
    Button,
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    store
} from "react-notifications-component";
import MaskedInput from "react-text-mask";
import moment from "moment";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const NotManager = (props) => {
    const { organization } = props;
    const classes = useStyles();

    const finalDate = moment(organization.packet.timestamp).add(organization.packet.period || 12, 'month').format('DD.MM.YYYY');

    return (
        <Box className={classes.box}>
            <Box className={classes.root}>
                <Grid container spacing={3}>

                    <Grid item>
                        <img src="/source/svg/logos/logo_clear.svg" style={{ width: 60 }}/>
                    </Grid>

                    <Grid item>
                        <Typography className={classes.title}>{allTranslations(localization.tariffTariffName)}: { organization.packet.name }</Typography>
                        <Typography className={classes.description}>{allTranslations(localization.tariffTariffDye)} { finalDate }</Typography>
                    </Grid>

                </Grid>
            </Box>
        </Box>
    )
};

const useStyles = makeStyles((theme) => ({
    box: {
        maxWidth: 570,

        marginBottom: 40
    },

    root: {
        padding: '24px',

        border: '1px solid rgba(168, 171, 184, 0.6)',
        borderRadius: 5
    },

    title: {
        fontSize: 20,
        lineHeight: '24px',

        marginBottom: 8
    },

    description: {
        fontSize: 16,
        lineHeight: '19px',
        color: '#999DB1'
    }
}));

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
            placeholderChar={'_'}
            showMask
        />
    );
}

export default NotManager
