import React from 'react';
import {
    Box,
    Grid,
    Button,
    TextField,
    Typography,
    InputAdornment
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    LevelOne,
    LevelOrher
} from '../../../../../icons';
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import alertNotification from "../../../../../common/alertNotification";

const ReferralSystem = (props) => {
    const {onChange, organization} = props;
    const classes = useStyles();

    const handleChangeLevelOne = ({target}) => {
        let newOrganization = {...organization};
        let value = target.value;
        let valueOther = organization.distributionSchema['other'];
        let isValidate = Boolean((Number.parseFloat(value) + Number.parseFloat(valueOther) + Number.parseFloat(newOrganization.cashback) + 5) <= 50);

        if (!isValidate) {
            alertNotification({
                title: allTranslations(localization.notificationSystemNotification),
                message: allTranslations(localization['organization_about.referralSystem.errorBigSum']),
                type: "warning"
            })

            return null
        }

        newOrganization.distributionSchema.first = value;
        newOrganization.distributionSchema.other = valueOther;

        onChange(newOrganization)
    }
    const handleChangeLevelOther = ({target}) => {
        let newOrganization = {...organization};
        let value = target.value;

        let isValidate = Boolean((Number.parseFloat(value) + Number.parseFloat(newOrganization.distributionSchema['first']) + Number.parseFloat(newOrganization.cashback) + 5) <= 50);
        if (!isValidate) {
            alertNotification({
                title: "Системное уведомление",
                message: "Сумма 1 уровня + 2-21 уровень + Расходы Adwise + Кэшбек покупателю не должны превышать 50%",
                type: "warning"
            })

            return null
        }

        newOrganization.distributionSchema.other = value;

        onChange(newOrganization);
    }
    const handleChangeCashback = ({target}) => {
        let newOrganization = {...organization};

        let isValidate = Boolean((Number.parseFloat(newOrganization.distributionSchema['first']) + Number.parseFloat(newOrganization.distributionSchema['other']) + Number.parseFloat(target.value) + 5) <= 50);
        if (!isValidate) {
            alertNotification({
                title: "Системное уведомление",
                message: "Сумма 1 уровня + 2-21 уровень + Расходы Adwise + Кэшбек покупателю не должны превышать 50%",
                type: "warning"
            })

            return null
        }

        newOrganization.cashback = target.value;

        onChange(newOrganization)
    }
    const handleReset = () => {
        let newOrganization = {...organization};

        newOrganization.distributionSchema.first = 5;
        newOrganization.distributionSchema.other = 10;
        newOrganization.cashback = 5;

        onChange(newOrganization)
    }

    const valueLevelOne = organization.distributionSchema['first'];
    const valueLevelOther = organization.distributionSchema['other'];

    return (
        <Box>
            <Box mb={2}>
                <Grid container spacing={2} alignItems="flex-end" wrap="nowrap">
                    <Grid item>
                        <Typography variant={"h3"}>{allTranslations(localization.organizationAboutReferralSystemTitle)}</Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="text" size="small" onClick={handleReset}>Сбросить</Button>
                    </Grid>
                </Grid>
            </Box>

            <Box mb={3}>
                <Typography className={classes.levelTitle}>{allTranslations(localization.organizationAboutReferralSystemFirstLevel)}</Typography>

                <Grid container spacing={2} wrap={'nowrap'} alignItems={'center'}>
                    <Grid item>
                        <TextField
                            value={valueLevelOne}

                            variant={"outlined"}

                            className={classes.input}
                            placeholder={'5'}
                            type={'number'}

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <span className={classes.inputAdornment}>%</span>
                                    </InputAdornment>
                                )
                            }}

                            onChange={handleChangeLevelOne}
                        />
                    </Grid>
                    <Grid item>
                        <LevelOne/>
                    </Grid>
                    <Grid item>
                        <Typography
                            className={classes.description}
                            dangerouslySetInnerHTML={{__html: `${allTranslations(localization.organizationAboutReferralSystemReferrerWillReceive1)} <span style='color: #ed8d00'>${valueLevelOne}</span><span style='color: #8152e4'>%</span> \nс ${allTranslations(localization.organizationAboutReferralSystemReferrerWillReceive2)}`}}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box mb={3}>
                <Typography className={classes.levelTitle}>{allTranslations(localization.organizationAboutReferralSystemOtherLevel)}</Typography>

                <Grid container spacing={2} wrap={'nowrap'} alignItems={'center'}>
                    <Grid item>
                        <TextField
                            value={valueLevelOther}
                            variant={"outlined"}

                            className={classes.input}
                            placeholder={'20'}

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <span className={classes.inputAdornment}>%</span>
                                    </InputAdornment>
                                )
                            }}

                            type={'number'}

                            onChange={handleChangeLevelOther}
                        />
                    </Grid>
                    <Grid item>
                        <LevelOrher/>
                    </Grid>
                    <Grid item>
                        <Typography
                            className={classes.description}
                            dangerouslySetInnerHTML={{__html: `${allTranslations(localization.organizationAboutReferralSystemReferrerWillReceive1)} <span style='color: #ed8d00'>${valueLevelOther / 20}</span><span style='color: #8152e4'>%</span> \nс ${allTranslations(localization.organizationAboutReferralSystemReferrerWillReceive2)}`}}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box mb={4}>
                <Typography className={classes.levelTitle}>{allTranslations(localization.organizationAboutReferralSystemAdwiseExpenses)}</Typography>

                <Grid container spacing={2} wrap={'nowrap'} alignItems={'center'}>
                    <Grid item>
                        <TextField
                            variant={"outlined"}

                            disabled

                            className={classes.input}
                            value={5}
                            placeholder={'5'}

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <span className={classes.inputAdornment}>%</span>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid item>
                        <Typography
                            className={classes.description}
                            dangerouslySetInnerHTML={{__html: allTranslations(localization.organizationAboutReferralSystemIncludingTransactionCosts)}}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box mb={4}>
                <Typography className={classes.levelTitle}>{allTranslations(localization.organizationAboutReferralSystemCashbackBuyer)}</Typography>

                <Grid container spacing={2} wrap={'nowrap'} alignItems={'center'}>
                    <Grid item>
                        <TextField
                            value={organization.cashback}
                            variant={"outlined"}

                            placeholder={'10'}
                            defaultValue={10}

                            className={classes.input}

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <span className={classes.inputAdornment}>%</span>
                                    </InputAdornment>
                                )
                            }}

                            onChange={handleChangeCashback}
                        />
                    </Grid>
                    <Grid item>
                        <Typography
                            className={classes.description}
                            dangerouslySetInnerHTML={{__html: allTranslations(localization.organizationAboutReferralSystemAmountReturnedCustomerPurchase)}}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    levelTitle: {
        fontSize: 16,
        lineHeight: "19px",
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: 8
    },

    input: {
        width: 100
    },
    inputAdornment: {
        fontSize: 16,
        lineHeight: 19,
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        color: '#9FA3B7'
    },

    description: {
        fontSize: 12,
        color: '#9FA3B7',
        lineHeight: '14px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
}));

export default ReferralSystem
