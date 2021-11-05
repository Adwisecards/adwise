import React from 'react';
import {
    Box,

    Grid,

    TextField,
    InputAdornment,

    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    LevelOne,
    LevelOrher
} from '../../../../../icons';

const ReferralSystem = (props) => {
    const {onChange, share, global} = props;
    const classes = useStyles();

    if (!share || !share.distributionSchema) {
        return null
    }

    const valueLevelOne = share.distributionSchema['first'];
    const valueLevelOther = share.distributionSchema['other'] * 20;

    return (
        <Box>
            <Box mb={3}>
                <Typography className={classes.levelTitle}>1 уровень</Typography>

                <Grid container spacing={2} wrap={'nowrap'} alignItems={'center'}>
                    <Grid item>
                        <TextField
                            value={valueLevelOne}

                            variant={"outlined"}

                            className={classes.input}
                            placeholder={'5'}
                            type={'number'}

                            disabled

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
                        <LevelOne/>
                    </Grid>
                    <Grid item>
                        <Typography
                            className={classes.description}
                            dangerouslySetInnerHTML={{__html: `<span style='color: #ed8d00'>Рекомендатель</span> получит ${ valueLevelOne }% \nс каждой покупки <span style='color: #8152e4'>друга</span>`}}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box mb={3}>
                <Typography className={classes.levelTitle}>2—21 уровень</Typography>

                <Grid container spacing={2} wrap={'nowrap'} alignItems={'center'}>
                    <Grid item>
                        <TextField
                            value={valueLevelOther}
                            variant={"outlined"}

                            className={classes.input}
                            placeholder={'20'}

                            disabled

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <span className={classes.inputAdornment}>%</span>
                                    </InputAdornment>
                                )
                            }}

                            type={'number'}
                        />
                    </Grid>
                    <Grid item>
                        <LevelOrher/>
                    </Grid>
                    <Grid item>
                        <Typography
                            className={classes.description}
                            dangerouslySetInnerHTML={{__html: `<span style='color: #ed8d00'>Рекомендатель</span> получит ${ valueLevelOther / 20 }% \nс каждой покупки <span style='color: #8152e4'>друга</span>`}}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box mb={4}>
                <Typography className={classes.levelTitle}>Расходы Adwise</Typography>

                <Grid container spacing={2} wrap={'nowrap'} alignItems={'center'}>
                    <Grid item>
                        <TextField
                            variant={"outlined"}

                            disabled

                            className={classes.input}
                            value={global.purchasePercent}
                            placeholder={'-'}

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <span className={classes.inputAdornment}>%</span>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box>
                <Typography className={classes.levelTitle}>Кэшбек покупателю</Typography>

                <Grid container spacing={2} wrap={'nowrap'} alignItems={'center'}>
                    <Grid item>
                        <TextField
                            value={share.offer.percent}
                            variant={"outlined"}

                            name={'offerPercent'}
                            placeholder={'-'}

                            type={'number'}

                            disabled

                            className={classes.input}

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <span className={classes.inputAdornment}>%</span>
                                    </InputAdornment>
                                )
                            }}
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
