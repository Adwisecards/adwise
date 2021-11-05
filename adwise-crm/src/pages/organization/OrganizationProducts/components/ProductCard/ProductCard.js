import React from "react";
import {
    Box,

    Grid,

    Switch,

    Typography,

    IconButton,

    Button
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    PlugsOrganizationBackground
} from '../../../../../icons';
import {formatMoney} from "../../../../../helper/format";
import axiosInstance from "../../../../../agent/agent";
import urls from "../../../../../constants/urls";

const ProductCard = (props) => {
    const { product } = props;
    const classes = useStyles();

    const priceProduct = formatMoney(product.price);

    const handleDisabledProduct = () => {
        product.disabled = !product.disabled;

        axiosInstance.put(`${ urls["set-product-disabled"]}${ product._id }`, {
            productId: product._id,
            disabled: product.disabled
        });

        props.onChangeProducts()
    }

    return (
        <Box className={classes.productCard}>
            <Grid container spacing={2} wrap={'nowrap'} >
                <Grid item>
                    <Box className={classes.productCardImage}>
                        {
                            (!!product.picture) ? (
                                <img src={ product.picture }/>
                            ) : (
                                <div className={classes.productCardImagePlug}>
                                    <PlugsOrganizationBackground/>
                                </div>
                            )
                        }
                    </Box>
                </Grid>
                <Grid item className={classes.cardHeaderRight}>
                    <Box mb={1} className={classes.productCardHeader}>
                        <Typography className={classes.productCardName}>
                            { product.name }
                        </Typography>

                        <Switch
                            checked={!product.disabled}
                            className={classes.productCardSwitch}

                            onClick={handleDisabledProduct}
                        />
                    </Box>
                    <Box>
                        <Typography className={classes.productCardDescription}>
                            { product.description }
                        </Typography>
                    </Box>
                    <Box>
                        <Typography className={classes.productCardPrice}>{ priceProduct } ₽</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.productCardFooter}>
                <Grid item>
                    <Typography className={classes.productCardFooterTitle}>Артикул</Typography>
                    <Typography className={classes.productCardFooterValue}>{ product.code }</Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    productCard: {
        flex: 1,

        display: 'flex',
        flexDirection: 'column',

        backgroundColor: 'white',

        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(168, 171, 184, 0.6)',

        padding: 12,
    },

    productCardImage: {
        width: 100,
        height: 100,

        borderRadius: 5,

        overflow: 'hidden',

        '& img': {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        }
    },

    cardHeaderRight: {
        flex: 1,
        maxWidth: 'calc(100% - 125px)'
    },

    productCardImagePlug: {
        backgroundColor: '#8152E4',

        display: 'flex',
        height: '100%',

        flex: 1
    },

    productCardHeader: {
        display: 'flex',

        justifyContent: 'space-between'
    },

    productCardName: {
        fontSize: 17,
        lineHeight: '20px',
        color: '#25233E',
        fontWeight: '500',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    productCardDescription: {
        fontSize: 12,
        lineHeight: '14px',
        color: '#9FA3B7',
        letterSpacing: '0.02em',
        wordWrap: 'break-word',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: 10
    },

    productCardPrice: {
        fontSize: 18,
        lineHeight: '22px',
        color: '#8152E4',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    productCardSwitch: {
        '&.MuiSwitch-root': {
            width: 38,
            height: 18,
            padding: 0
        },
        '& .MuiSwitch-thumb': {
            width: 12,
            height: 12
        },
        '& .MuiSwitch-switchBase': {
            padding: 3
        }
    },

    productCardFooter: {
        flex: 1,

        alignItems: 'flex-end',

        marginTop: 8
    },

    productCardFooterTitle: {
        fontSize: 11,
        lineHeight: '13px',
        color: '#9FA3B7',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: 5
    },

    productCardFooterValue: {
        fontSize: 12,
        lineHeight: '14px',
        color: '#25233E',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'tnum' on, 'lnum' on, 'ss03' on, 'ss06' on",
    }
}));

export default ProductCard
