import React from "react";
import {
    View,

    Text,

    StyleSheet,

    TouchableOpacity
} from 'react-native';
import {formatMoney} from "../../../../../helper/format";

const TotalInformation = (props) => {
    const {buyItems, coupons, onConfirmation} = props;

    const handleGetPrice = () => {
        let price = 0;

        buyItems.map((item) => {
            const butItem = coupons.find((itemList) => itemList._id === item._id);

            if (butItem.price) {
                price += butItem.price * item.count;
            }
        })

        return formatMoney(price)
    }
    const handleGetCount = () => {
        let count = 0;

        buyItems.map((item) => {
            count += item.count;
        })

        return formatMoney(count)
    }

    return (
        <View style={styles.root}>

            <Text style={styles.text}>{handleGetCount()} позиции / {handleGetPrice()} ₽</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 16,

        justifyContent: 'space-between',

        marginBottom: 8
    },

    text: {
        fontFamily: 'AtypDisplay_medium',
        fontSize: 18,
        lineHeight: 22,
        letterSpacing: 1,
    },

    button: {
        paddingVertical: 8,
        paddingHorizontal: 20,

        backgroundColor: '#8152E4',
        borderRadius: 6
    },
    buttonDisabled: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    buttonText: {
        fontFamily: 'AtypDisplay_medium',
        fontSize: 16,
        lineHeight: 19,
        color: 'white',
        textAlign: 'center'
    }
})

export default TotalInformation