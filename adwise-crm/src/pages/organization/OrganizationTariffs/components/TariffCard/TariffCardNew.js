import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import clsx from "clsx";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";

const TariffCard = (packet) => {
    const classes = useStyles();


    return (
        <Box
            className={classes.card}
            border="0.5px solid rgba(168, 171, 184, 0.6)"
            width={275}
            p={4}
            borderRadius={5}
            bgcolor="white"
        >
            <Box mb={1}>
                <Typography variant="subtitle1">{allTranslations(localization.organizationAboutTabsTariff)}</Typography>
            </Box>
            <Box mb={2}>
                <Typography variant="h2">{packet.name}</Typography>
            </Box>
            <Box>
                <Typography style={{fontSize: '36px', lineHeight: '38px', fontWeight: '500'}} color="primary">
                    {`${formatMoney(packet.price)}${currency[packet.currency]}`}
                </Typography>
            </Box>
            <Box>
                <Typography style={{lineHeight: '16px'}} variant="subtitle1" color="primary">
                    {allTranslations(localization.tariffRestrictions, {limit: packet.limit})}
                </Typography>
            </Box>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    card: {},
    cardActive: {
        backgroundColor: theme.palette.primary.main,
        '& *': {
            color: "white!important"
        }
    },
    cardDisabled: {
        pointerEvents: "none",
        opacity: 0.6,
        backgroundColor: "rgba(0, 0, 0, 0.01)"
    }
}));

TariffCard.defaultProps = {
    restrictions: 'Без ограничений',
    type: 'Тариф'
}

export default TariffCard
