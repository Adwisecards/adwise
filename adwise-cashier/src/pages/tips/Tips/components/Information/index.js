import React from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";

const Information = (props) => {

    return (
        <View style={styles.root}>

            <View style={[styles.row, { marginBottom: 8 }]}>
                <Text style={styles.textAmount}>Сумма зачислений</Text>
                <Text style={[styles.textAmount, { fontSize: 20 }]}>{ props.stats.tipsSum } ₽</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.textCount}>Количество зачислений</Text>
                <Text style={[styles.textCount, { fontSize: 18 }]}>{ props.stats.tipsCount }</Text>
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,

        paddingVertical: 18,
        paddingHorizontal: 24,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    textAmount: {
        fontFamily: 'AtypDisplay_medium',
        fontSize: 18,
        lineHeight: 22,
        color: '#25233E'
    },

    textCount: {
        fontFamily: 'AtypDisplay',
        fontSize: 16,
        lineHeight: 19,
        color: '#25233E'
    }
});

export default Information
