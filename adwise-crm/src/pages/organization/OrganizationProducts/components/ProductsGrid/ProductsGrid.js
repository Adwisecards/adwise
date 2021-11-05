import React from "react";
import {
    Box,

    Grid
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    ProductCard
} from '../../components';

const ProductsGrid = (props) => {
    const {products, onChangeProducts} = props;
    const classes = useStyles();

    return (
        <Box>
            <Grid container spacing={3}>
                {
                    products.map((product, idx) => (
                        <Grid item className={classes.card}>
                            <ProductCard
                                key={`product-${idx}`}

                                products={products}
                                onChangeProducts={onChangeProducts}

                                product={product}
                            />
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    card: {
        width: 'calc(100% / 3)',
        maxWidth: 350,

        display: 'flex'
    }
}))

export default ProductsGrid
