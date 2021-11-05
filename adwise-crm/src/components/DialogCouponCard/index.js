import React from "react";
import {
    Box,
    Grid,
    Button,
    Typography
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {getMediaUrl} from "../../common/media";
import {formatMoney} from "../../helper/format";
import {
    Plus as PlusIcon,
    Minus as MinusIcon
} from "react-feather";
import currency from "../../constants/currency";
import clsx from "clsx";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const DialogCouponCard = (props) => {
    const {coupon, count, onChange} = props;
    const classes = useStyles();

    const handleOnAdd = () => {
        onChange({...coupon, count: count + 1});
    }
    const handleOnRemove = () => {
        onChange({...coupon, count: count - 1});
    }

    return (
        <Box
            className={clsx({
                [classes.card]: true,
                [classes.cardActive]: Boolean(count && count > 0),
            })}
        >

            <Box className={classes.cardBody} onClick={Boolean(count && count > 0) ? null : handleOnAdd}>

                <img
                    src={getMediaUrl(coupon.pictureMedia, '/img/empty-png.png')}
                    className={classes.image}
                />

                <Box className={classes.cardBodyLeft}>

                    <Typography className={classes.couponName}>{coupon?.name || ''}</Typography>
                    <Typography className={classes.couponDescription}>{coupon?.description || ''}</Typography>
                    <Typography
                        className={classes.couponPrice}>{formatMoney(coupon?.price, 0, '')} {currency.rub}</Typography>

                </Box>

            </Box>

            {
                Boolean(count > 0) && (
                    <Box className={clsx({
                        [classes.cardFooter]: true,
                        [classes.cardFooterActive]: Boolean(count && count > 0),
                    })}>
                        <Grid container justify="space-between" alignItems="center">
                            <Grid item>
                                <Typography className={classes.countTitle}>{allTranslations(localization['bill_create.productCard.amount'])}</Typography>
                            </Grid>
                            <Grid item>
                                <Grid container spacing={1} alignItems="center">
                                    <Grid item>
                                        <Button className={classes.buttonCount} onClick={handleOnRemove}
                                                disabled={count <= 0}>
                                            <MinusIcon color="white" size={15}/>
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Typography className={classes.count}>{count}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Button className={classes.buttonCount} onClick={handleOnAdd}
                                                disabled={count >= coupon.quantity}>
                                            <PlusIcon color="white" size={15}/>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                )
            }

            {
                Boolean(count <= 0) && (
                    <Box className={clsx({
                        [classes.cardFooter]: true
                    })}>
                        <Grid container justify="space-between" alignItems="center">
                            <Grid item>
                                <Typography className={classes.footerTitle} dangerouslySetInnerHTML={{ __html: allTranslations(localization['bill_create.productCard.amountTitle']) }}/>
                                <Typography className={classes.footerValue}>{ formatMoney(coupon.quantity, 0, '') }</Typography>
                            </Grid>
                            <Grid item>
                                <Typography className={classes.footerTitle} dangerouslySetInnerHTML={{ __html: allTranslations(localization['bill_create.productCard.floatingTitle']) }}/>
                                <Typography className={classes.footerValue}>{ Boolean(coupon.floating) ? allTranslations(localization['bill_create.productCard.yes']) : allTranslations(localization['bill_create.productCard.no']) }</Typography>
                            </Grid>
                            <Grid item>
                                <Typography className={classes.footerTitle} dangerouslySetInnerHTML={{ __html: allTranslations(localization['bill_create.productCard.ageRestrictedTitle']) }}/>
                                <Typography className={classes.footerValue}>{ Boolean(coupon.ageRestricted) ? allTranslations(localization['bill_create.productCard.yes']) : allTranslations(localization['bill_create.productCard.no']) }</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )
            }

        </Box>
    )
};

const useStyles = makeStyles(() => ({
    card: {
        cursor: "pointer",

        width: '100%',

        border: "0.5px solid rgba(168, 171, 184, 0.6)",
        borderRadius: 5,
        backgroundColor: 'white',

        "&:hover": {
            backgroundColor: 'rgb(129, 82, 228, 0.1)'
        }
    },
    cardActive: {
        borderColor: "#8152E4",
        boxShadow: "0 0 0 2px #8152E4"
    },
    cardBody: {
        display: 'flex',
        padding: 12,
    },
    cardBodyLeft: {
        display: 'flex',
        flexDirection: 'column'
    },
    cardFooter: {
        height: 50,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px'
    },
    cardFooterActive: {
        backgroundColor: '#8152E4'
    },

    image: {
        width: 100,
        height: 100,
        border: "0.5px solid rgba(168, 171, 184, 0.6)",
        borderRadius: 5,
        backgroundColor: '#E9E9E9',

        marginRight: 16
    },

    couponName: {
        fontSize: 17,
        lineHeight: '20px',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#25233E',
        marginBottom: 8,
        fontWeight: '500'
    },
    couponDescription: {
        fontSize: 12,
        lineHeight: '14px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#999DB1',
        marginBottom: 12
    },
    couponPrice: {
        fontSize: 18,
        lineHeight: '22px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#8152E4',
        marginTop: 'auto'
    },

    countTitle: {
        fontSize: 15,
        lineHeight: '18px',
        fontWeight: '500',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: 'white'
    },
    count: {
        fontSize: 15,
        lineHeight: '15px',
        textAlign: 'center',
        color: 'white',
        fontWeight: '500',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
    buttonCount: {
        width: 25,
        height: 25,
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        opacity: '0.3',
        border: "1px solid #FFFFFF",
        minWidth: 'initial',

        '&:hover': {
            opacity: 1
        }
    },

    footerTitle: {
        fontSize: 10,
        lineHeight: '11px',
        color: '#999DB1',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        marginBottom: 4
    },
    footerValue: {
        fontSize: 12,
        lineHeight: '14px',
        color: '#25233E',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'tnum' on, 'lnum' on, 'ss03' on, 'ss06' on"
    },
}));

export default DialogCouponCard
