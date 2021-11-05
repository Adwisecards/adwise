import React from "react";
import {
    Box,
    Grid,
    Button,
    Tooltip,
    TextField,
    Typography,

    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    PlusCircle as PlusCircleIcon
} from "react-feather";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import {getMediaUrl} from "../../../../../common/media";
import {NumericalReliability} from "../../../../../helper/numericalReliability";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const ProductsSelected = (props) => {
    const { selected, onChange, onOpenSelected } = props;
    const classes = useStyles();

    const handleOnChangeCouponPrice = (coupon, price) => {
        let newSelected = [...selected];
        let product = newSelected.find((t) => t._id === coupon._id);
        product.price = price;
        onChange(newSelected);
    }

    const _getTotal = () => {
        let count = selected.reduce((current, item) => {
            return current + item.count
        }, 0)
        let price = selected.reduce((current, item) => {
            return current + ( item.count * item.price )
        }, 0)

        return `${ count } ${ NumericalReliability(count, [
            allTranslations(localization['bill_create.productsSelected.position1']),
            allTranslations(localization['bill_create.productsSelected.position2']),
            allTranslations(localization['bill_create.productsSelected.position3'])
        ]) } ${ price } ${ currency.rub }`
    }

    return (
        <>

            <Box mb={3}>
                <Typography className={classes.title}>{allTranslations(localization['bill_create.productsSelected.title'])}</Typography>
            </Box>

            <Box mb={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{allTranslations(localization['bill_create.productsSelected.table.product'])}</TableCell>
                            <TableCell>{allTranslations(localization['bill_create.productsSelected.table.quantity'])}</TableCell>
                            <TableCell>{allTranslations(localization['bill_create.productsSelected.table.price'])}</TableCell>
                            <TableCell align="right">{allTranslations(localization['bill_create.productsSelected.table.sum'])}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            selected.map((product, idx) => (
                                <TableRow key={`select-product-${idx}`}>
                                    <TableCell>
                                        <Grid container spacing={1} alignItems="center">
                                            <Grid item>
                                                <img
                                                    src={getMediaUrl(product.pictureMedia, '/img/empty-png.png')}
                                                    className={classes.productImage}
                                                />
                                            </Grid>
                                            <Grid item>
                                                { product.name }
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell>{ product.count }</TableCell>
                                    <TableCell>
                                        {
                                            Boolean(product.floating) ? (
                                                <TextField
                                                    variant="outlined"
                                                    type="number"
                                                    value={product.price}
                                                    onChange={({target}) => handleOnChangeCouponPrice(product, target.value)}
                                                />
                                            ) : (
                                                <Typography>{ formatMoney(product.price, 2, '.') } { currency.rub } { currency.rub }</Typography>
                                            )
                                        }
                                    </TableCell>
                                    <TableCell align="right">{ formatMoney(product.count * product.price, 2, '.') } { currency.rub }</TableCell>
                                </TableRow>
                            ))
                        }
                        {
                            Boolean(selected.length > 0) && (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Grid container justify="flex-end">
                                            <Grid item>

                                                <Typography className={classes.total}>{allTranslations(localization['bill_create.productsSelected.table.total'])}: {_getTotal()}</Typography>

                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </Box>

            <Box>
                <Button variant="text" onClick={onOpenSelected}>
                    <PlusCircleIcon color="#8152E4" size={20} style={{marginRight: 8}}/>

                    {allTranslations(localization['bill_create.productsSelected.add_product'])}
                </Button>
            </Box>

        </>
    )
}

const useStyles = makeStyles(() => ({
    title: {
        fontSize: 20,
        lineHeight: '24px',
        fontWeight: '500',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: "#25233E"
    },

    total: {
        marginRight: 24,

        fontSize: 18,
        lineHeight: '56px',
        color: '#25233E',
        fontWeight: '500',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        textAlign: "right"
    },

    productImage: {
        width: 50,
        height: 50,
        border: "0.5px solid rgba(168, 171, 184, 0.6)",
        borderRadius: 5,
        backgroundColor: '#E9E9E9',

        marginRight: 16
    }
}));

export default ProductsSelected
