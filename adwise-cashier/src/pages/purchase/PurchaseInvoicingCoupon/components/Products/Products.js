import React from "react";
import {
    View,
    Text,

    SafeAreaView,
    FlatList,

    StyleSheet, ScrollView
} from 'react-native';
import {formatMoney} from "../../../../../helper/format";

const Row = (props) => {
    const isDark = (props.idx % 2 === 1) ? true : false;
    const price = formatMoney(props.price);
    const totalPrice = formatMoney(props.price * props.count);

    return (
        <View style={[
            styles.row,
            (isDark) && styles.rowDark,
        ]}>
            <Text style={styles.rowName}>{ props.name }</Text>

            <View style={styles.rowItems}>

                <View style={styles.rowItem}>
                    <Text style={[styles.rowItemText, {marginBottom: 4}]}>Штук</Text>
                    <Text style={styles.rowItemText}>{ props.count }</Text>
                </View>

                <View style={styles.rowItem}>
                    <Text style={[styles.rowItemText, {marginBottom: 4}]}>Цена</Text>
                    <Text style={styles.rowItemText}>{price} ₽</Text>
                </View>

                <View style={styles.rowItem}>
                    <Text style={[styles.rowItemText, {marginBottom: 4}]}>Итого</Text>
                    <Text style={styles.rowItemText}>{totalPrice} ₽</Text>
                </View>


            </View>

        </View>
    )
}

const Products = (props) => {
    const { coupons } = props;

    return (
        <View style={styles.root}>

            {
                coupons.map((item, idx) => (
                    <Row key={idx} idx={idx} {...item}/>
                ))
            }

        </View>
    )
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: 'rgba(168, 171, 184, 0.05)',
        borderRadius: 10,

        marginBottom: 24
    },

    row: {
        padding: 16,
    },
    rowDark: {
        backgroundColor: 'rgba(168, 171, 184, 0.05)',
    },
    rowName: {
        maxWidth: '70%',
        marginBottom: 12,

        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 17
    },
    rowItems: {
        flexDirection: 'row',

        marginLeft: -24
    },
    rowItem: {
        marginLeft: 24
    },
    rowItemText: {
        fontSize: 12,
        lineHeight: 14,
        color: '#808080',
        fontFamily: 'AtypText'
    }
});

export default Products
