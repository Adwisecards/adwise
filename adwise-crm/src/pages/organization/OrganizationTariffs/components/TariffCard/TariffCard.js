import React, { useState } from 'react';
import {
    Box,
    Grid,
    Button,
    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {NumericalReliability} from "../../../../../helper/numericalReliability";



const useStyles = makeStyles((theme) => ({
    box: {
        borderRadius: 5,
        background:'white',
        width: 276,
        height: '100%',
        marginBottom: 12,
        flexDirection: 'column',
        justifyContent: 'left',
        textAlign:'left',
        textTransform:'none',
        border: '1px solid #cbccd4',
    },

    boxContent:{
        padding: '32px 32px 25px',
        minHeight: '267px',
    },
    boxContentIsWineWin:{
        padding: '32px 32px 25px',
        minHeight: '267px',
    },
    h6: {
        fontSize: 28,
        marginBottom: 16,
        fontWeight: 500,
        lineHeight: '28px',
    },
    h2:{
        fontWeight: 500,
        fontSize: 36,
        color: '#8152E4',
        lineHeight: '54px',
        marginBottom: 4,
    },
    body1: {
        fontSize: 16,
        color: '#8152E4',
        marginBottom: 24,
    },
    body2: {
        fontSize: 16,
        marginBottom: 8,
        color: '#25233E',

    },
    button:{
        width:142,
        height: 37,
        background:'#8152E4',
        fontSize: 16,
        color: 'white',
        textTransform: 'none',
        alignSelf: 'center',
        '&:hover': {
            color:'#8152E4',
        },
    },
    body1Stock:{
        minHeight: 48,
        width: '100%',
        background: '#fbe8cc',
        color: '#ED8E00',
        marginBottom:0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
        padding: '10px 32px',
        lineHeight: '14px',
        borderRadius: '0 0 5px 5px'
    },
    dn:{
        display:'none'
    },
    buttonSelected:{
        background: 'transparent',
        border: '1px solid #8152E4',
        color: '#8152E4',
        '&:hover':{
            background: '#8152E4',
            color:'white'
        },
    },
    disabledBox:{
        opacity: '0.6'
    },
    buttonDisabled:{
        width: 142,
        height: 37,
        color: 'white'
    }
}));

const TariffCard = ({tariffName, contribution, durationOfContribution, restrictions, type, isWineWin=false, onClick, disabled, selected, limit}) => {
    const classes = useStyles();

    return (
        <Box className={!disabled ? classes.box : `${classes.box} ${classes.disabledBox}`} mr={2}>
            <Box className={isWineWin ? classes.boxContentIsWineWin : classes.boxContent }>
                <Typography className={classes.body2} variant="body2" gutterBottom>
                    {type}
                </Typography>
                <Typography className={classes.h6} variant="h6" gutterBottom>
                    {tariffName}
                </Typography>
                <Typography className={classes.h2} variant="h2" gutterBottom>
                    {contribution} / {durationOfContribution}
                </Typography>
                <Typography className={classes.body1} variant="body1" gutterBottom>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item>
                            {
                                Boolean(limit >= 999) ? (
                                    <Box width={20} height={20}>
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100">
                                            <path
                                                d="M79.514,28C69.118,28,57.723,33.792,50,42.577C42.275,33.792,30.881,28,20.486,28
		C10.582,28,0,33.779,0,50s10.582,21.999,20.486,22l0,0C30.883,72,42.275,66.209,50,57.426C57.723,66.209,69.117,72,79.512,72
		C89.418,72,100,66.221,100,50S89.418,28,79.514,28z M20.486,63.201C12.926,63.201,9.09,58.76,9.09,50
		c0-8.757,3.836-13.2,11.396-13.2c8.361,0,18.07,5.427,24.031,13.2C38.557,57.773,28.85,63.201,20.486,63.201z M79.512,63.201
		c-8.361,0-18.07-5.428-24.029-13.201c5.959-7.773,15.67-13.2,24.031-13.2c7.562,0,11.396,4.442,11.396,13.2
		C90.908,58.76,87.074,63.201,79.512,63.201z"
                                                fill="#8152E4"
                                            />
                                        </svg>
                                    </Box>
                                ) : limit
                            }
                        </Grid>
                        <Grid item>{NumericalReliability(limit, ['сотрудник', 'сотрудника', 'сотрудников'])}</Grid>
                        <Grid item>
                            {
                                Boolean(limit >= 999) ? (
                                    <Box width={20} height={20}>
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100">
                                            <path
                                                d="M79.514,28C69.118,28,57.723,33.792,50,42.577C42.275,33.792,30.881,28,20.486,28
		C10.582,28,0,33.779,0,50s10.582,21.999,20.486,22l0,0C30.883,72,42.275,66.209,50,57.426C57.723,66.209,69.117,72,79.512,72
		C89.418,72,100,66.221,100,50S89.418,28,79.514,28z M20.486,63.201C12.926,63.201,9.09,58.76,9.09,50
		c0-8.757,3.836-13.2,11.396-13.2c8.361,0,18.07,5.427,24.031,13.2C38.557,57.773,28.85,63.201,20.486,63.201z M79.512,63.201
		c-8.361,0-18.07-5.428-24.029-13.201c5.959-7.773,15.67-13.2,24.031-13.2c7.562,0,11.396,4.442,11.396,13.2
		C90.908,58.76,87.074,63.201,79.512,63.201z"
                                                fill="#8152E4"
                                            />
                                        </svg>
                                    </Box>
                                ) : limit
                            }
                        </Grid>
                        <Grid item>{NumericalReliability(limit, ['акция', 'акции', 'акций'])}</Grid>
                    </Grid>
                </Typography>
                <Button disabled={disabled} onClick={onClick} className={!selected ? classes.button : `${classes.button} ${classes.buttonSelected}`}>
                    {!selected ? 'Подключить' : 'Отменить'}
                </Button>
            </Box>
            <Box>
                <Typography className={isWineWin? classes.body1Stock : classes.dn} variant="body1" gutterBottom>
                    Бесплатно для партнеров WiseWin с активным пакетом Start и выше
                </Typography>
            </Box>
        </Box>
    )
}

TariffCard.defaultProps = {
    restrictions: 'Без ограничений',
    type: 'Тариф'
}

export default TariffCard
