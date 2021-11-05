import React from "react";
import {
    Box,
    Grid,
    Typography
} from "@material-ui/core";
import {
    Skeleton
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const Informations = (props) => {
    const { client, isLoading } = props;

    return (
        <Grid container spacing={1}>
            <Grid item>
                <Information
                    title={allTranslations(localization.clientInformationPurchaseCount)}
                    value={formatMoney(client?.stats?.purchaseCount || 0, 0, ' ')}

                    isLoading={isLoading}
                />
            </Grid>
            <Grid item>
                <Information
                    title={allTranslations(localization.clientInformationPurchaseSum)}
                    value={`${formatMoney(client?.stats?.purchaseSum || 0, 0, ' ')} ${currency["rub"]}`}

                    isLoading={isLoading}
                />
            </Grid>
            <Grid item>
                <Information
                    title={allTranslations(localization.clientInformationCashbackCount)}
                    value={`${formatMoney(client?.stats?.cashbackSum || 0, 0, ' ')} ${currency["rub"]}`}

                    isLoading={isLoading}
                />
            </Grid>
            <Grid item>
                <Information
                    title={allTranslations(localization.clientInformationUsedPointsSum)}
                    value={`${formatMoney(client?.stats?.usedPointsSum || 0, 0, ' ')} ${currency["rub"]}`}

                    isLoading={isLoading}
                />
            </Grid>
        </Grid>
    )

}
const Information = (props) => {
    const classes = useStyles();

    return (
        <Box className={classes.item}>
            <Typography className={classes.itemTitle}>{ props.title }</Typography>
            <Typography className={classes.itemValue}>{ props.value }</Typography>
        </Box>
    )
}

const useStyles = makeStyles(() => ({
    item: {
        padding: 16,
        borderRadius: 8,
        border: "1px solid rgba(168, 171, 184, 0.6)"
    },
    itemTitle: {
        fontSize: 15,
        lineHeight: '18px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#999DB1',

        marginBottom: 8
    },
    itemValue: {
        fontSize: 18,
        lineHeight: '22px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#25233E',
        fontWeight: "500"
    },
}));

export default Informations
