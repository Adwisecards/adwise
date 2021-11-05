import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {formatMoney} from "../../../../../helper/format";
import {getMediaUrl} from "../../../../../common/media";
import imageCouponPlug from "../../../../../../assets/graphics/plugs/coupon_popup_plug.png";

const ProductsTable = (props) => {
    const {initProducts, currency, onOpen} = props;

    const [products, setProducts] = useState([]);

    useEffect(() => {
        let products = [];

        initProducts.map((product) => {
            const isProduct = Boolean(products.find((t) => t._id === product._id));

            if (isProduct) {
                products.find((t) => t._id === product._id).count++;
            } else {
                products.push({...product, count: 1})
            }
        })

        setProducts(products);
    }, [initProducts]);

    return (
        <View style={styles.root}>

            <View style={styles.container}>

                {
                    products.map((product, idx) => (
                        <Product
                            key={`table-product-${product._id}-${idx}`}
                            product={product}
                            currency={currency}
                            onOpen={onOpen}
                        />
                    ))
                }

            </View>

        </View>
    )
}

const Product = ({product, currency, onOpen}) => {
    return (
        <TouchableOpacity style={styles.product} onPress={() => onOpen(product)}>

            <View style={styles.productImage}>
                <Image
                    style={{width: '100%', height: '100%'}}
                    resizeMode="cover"
                    source={Boolean(!product.pictureMedia) ? imageCouponPlug : {uri: getMediaUrl(product.pictureMedia)}}
                />
            </View>

            <View style={styles.productBody}>
                <Text style={styles.productName}>{product.name}</Text>

                <View style={styles.productInfo}>
                    <Text style={styles.productPrice}>{formatMoney(product.price)} {currency}</Text>
                    <Text style={styles.productCount}>{product.count} шт</Text>
                </View>
            </View>

        </TouchableOpacity>
    )
};


const styles = StyleSheet.create({
    root: {
        marginBottom: 38,
    },
    container: {
        marginBottom: -16
    },

    product: {
        flexDirection: 'row',
        marginBottom: 16
    },
    productImage: {
        width: 52,
        height: 52,
        backgroundColor: '#E9E9E9',
        borderRadius: 5,
        overflow: 'hidden'
    },
    productBody: {
        flex: 1,
        marginLeft: 12
    },
    productName: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 17,
        color: '#25233E',
        marginBottom: 4
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto'
    },
    productPrice: {
        fontFamily: 'AtypText_semibold',
        fontSize: 12,
        lineHeight: 14,
        color: '#25233E'
    },
    productCount: {
        fontFamily: 'AtypText_semibold',
        fontSize: 12,
        lineHeight: 14,
        color: '#8152E4'
    },
});

export default ProductsTable
