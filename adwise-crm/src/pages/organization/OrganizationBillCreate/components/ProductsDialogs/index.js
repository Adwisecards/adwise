import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    TextField,
    Typography,

    Tabs,
    Tab,

    Dialog,
    DialogContent, Button
} from "@material-ui/core";
import {
    Pagination
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import axiosInstance from "../../../../../agent/agent";
import urls from "../../../../../constants/urls";
import {getPageFromCount} from "../../../../../common/pagination";
import {DialogCouponCard} from "../../../../../components";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const initialFilter = {
    limit: 10,
    page: 1,
    type: '',
    name: '',
};

let timeoutSearch;

const ProductsDialogs = (props) => {
    const { open, onClose, onChange, selected, organizationId } = props;
    const classes = useStyles();

    const [filter, setFilter] = useState({...initialFilter});
    const [isLoading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({count: 1});
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setFilter({...initialFilter});
        setPagination({count: 1});

        ( async () => {
            await handleGetProducts();
        })();

    }, [open]);
    useEffect(() => {
        ( async () => {
            await handleGetProducts();
        })();
    }, [filter]);


    // Получение продуктов
    const handleGetProducts = async () => {

        setLoading(true);

        const filter = _getFilter();
        const { coupons, count } = await axiosInstance.get(`${ urls["get-coupons"] }${ organizationId }${ filter }`).then((response) => {
            return response.data.data
        }).catch((error) => {
            return {
                coupons: []
            }
        });

        setProducts(coupons);
        setPagination({ count: getPageFromCount(count, filter.limit || 10) });
        setLoading(false);
    }
    const _getFilter = () => {
        let string = [];

        Object.keys(filter).map((key) => {
           const value = filter[key];

           if (!!value) {
               string.push(`${key}=${value}`)
           }
        });

        return `?${ string.join('&') }`
    }

    // Изменение фильтра
    const handleOnChangeFilter = ({ target }) => {
        const { name, value } = target;
        let newFilter = {...filter};
        newFilter[name] = value;
        setFilter(newFilter);
    }

    // Изменение кол-во товаров
    const handleOnChange = (coupon) => {
        let newSelected = [...selected];
        let index = newSelected.findIndex((t) => t._id === coupon._id);

        if (index > -1) {
            newSelected.splice(index, 1);
        }

        if (coupon.count > 0) {
            newSelected.push(coupon);
        }

        onChange(newSelected);
    }

    return (
        <Dialog
            open={open}
            maxWidth="lg"
            fullWidth
            scroll="body"
            onClose={onClose}
        >

            <DialogContent style={{ padding: 0 }}>

                <Box py={4} px={6}>

                    <Box mb={6}>

                        <Grid container spacing={4} alignItems="center">
                            <Grid item>
                                <Typography variant="modalTitle">{allTranslations(localization['bill_create.productsDialogs.title'])}</Typography>
                            </Grid>
                            <Grid item>
                                <Tabs className={classes.tabs} value={filter.type} onChange={(event, value) => handleOnChangeFilter({target: {name: 'type', value}})}>
                                    <Tab value="" label={allTranslations(localization['bill_create.productsDialogs.tabs.all'])}/>
                                    <Tab value="product" label={allTranslations(localization['bill_create.productsDialogs.tabs.product'])}/>
                                    <Tab value="service" label={allTranslations(localization['bill_create.productsDialogs.tabs.service'])}/>
                                </Tabs>
                            </Grid>
                            <Grid item>
                                <TextField
                                    value={filter.name}
                                    name="name"
                                    placeholder={allTranslations(localization['bill_create.productsDialogs.placeholderSearch'])}
                                    variant="outlined"
                                    onChange={handleOnChangeFilter}
                                />
                            </Grid>
                        </Grid>

                    </Box>

                    <Box>

                        {

                            Boolean( isLoading ) && (
                                <Typography variant="subtitle2">{allTranslations(localization['bill_create.productsDialogs.loadingProgress'])}</Typography>
                            )

                        }

                        {

                            Boolean( !isLoading && (products || []).length <= 0 ) && (
                                <Typography variant="subtitle2">{allTranslations(localization['bill_create.productsDialogs.noResultsFoundSearch'])}</Typography>
                            )

                        }

                        {

                            Boolean( !isLoading && (products || []).length > 0 ) && (
                                <>

                                    <Grid container spacing={3}>

                                        {
                                            products.map((product, idx) => (
                                                <Grid item xs={4} key={`product-${ idx }`}>
                                                    <DialogCouponCard
                                                        key={`coupon-${idx}`}
                                                        count={selected.find((t) => t._id === product._id)?.count || 0}
                                                        coupon={product}
                                                        onChange={handleOnChange}
                                                    />
                                                </Grid>
                                            ))
                                        }

                                    </Grid>

                                    <Box mt={2}>
                                        <Grid container justify="flex-end">
                                            <Grid item>
                                                <Pagination
                                                    page={filter.page}
                                                    count={pagination.count}
                                                    onChange={(event, value) => handleOnChangeFilter({target: {name: 'page', value}})}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>

                                </>
                            )

                        }

                    </Box>

                    <Box mt={2}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button variant="contained" onClick={onClose}>Подтвердить</Button>
                            </Grid>
                        </Grid>
                    </Box>

                </Box>

            </DialogContent>

        </Dialog>
    )
}

const useStyles = makeStyles(() => ({
    tabs: {
        minHeight: 40,

        '& .MuiButtonBase-root': {
            padding: '0px 32px',
            minHeight: 32,
            minWidth: 'initial'
        }
    }
}));

export default ProductsDialogs
