import React from "react";
import {
    Box,

    Grid,

    Button,

    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {useHistory} from 'react-router-dom';

import {ReactComponent as Image} from '../../../../../assets/images/organization-clients/Description.svg'
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const NoCoupons = (props) => {
    const classes = useStyles();
    const history = useHistory();

    const handleToCreateCoupon = () => {
        history.push('/shares/create');
    }

    return (
        <Grid container justify={'center'} alignItems={'center'}>
            <Grid item>
                <Box mb={4}>
                    <Image />
                </Box>

                <Box mb={4}>
                    <Box mb={1}>
                        <Typography variant={'h3'} align={'center'}>{allTranslations(localization.couponsNoCouponsTitle)}</Typography>
                    </Box>
                    <Typography
                        variant={"body2"}
                        align={'center'}
                        dangerouslySetInnerHTML={{__html: allTranslations(localization.couponsNoCouponsMessage)}}
                    />
                </Box>

                <Box className={classes.boxButton}>
                    <Button variant={'contained'} onClick={handleToCreateCoupon}>{allTranslations(localization.couponsNoCouponsCreate)}</Button>
                </Box>
            </Grid>
        </Grid>
    )
}

const useStyles = makeStyles((theme) => ({
    boxButton: {
        display: 'flex',
        justifyContent: 'center'
    }
}))

export default NoCoupons
