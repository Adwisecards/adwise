import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {formatMoney} from "../../../../../helper/format";
import getHeightStatusBar from "../../../../../helper/getHeightStatusBar";

const heightStatusBat = getHeightStatusBar();

const Header = (props) => {
    const { stats } = props;


    return (
        <View style={styles.root}>

           <View style={styles.items}>

               <View style={styles.item}>
                   <Text style={styles.itemTitle}>{`Количество\nопераций`}</Text>
                   <Text style={styles.itemValue}>{ stats.purchaseCount }</Text>
               </View>

               <View style={styles.separate}/>

               <View style={styles.item}>
                   <Text style={[styles.itemTitle, { textAlign: 'right' }]}>{`Операции\nна сумму`}</Text>
                   <Text style={[styles.itemValue, { textAlign: 'right' }]}>{ formatMoney(stats.purchaseSum) } ₽</Text>
               </View>

           </View>

        </View>
    )
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: 'white',

        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12,

        paddingHorizontal: 34,
        paddingVertical: 16,
        paddingTop: heightStatusBat + 16,

        elevation: 3,

        marginTop: -heightStatusBat
    },

    items: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    item: {},
    itemTitle: {
        fontFamily: 'AtypDisplay',
        fontSize: 14,
        lineHeight: 17,
        color: '#808080',

        marginBottom: 4
    },
    itemValue: {
        fontFamily: 'AtypDisplay_medium',
        fontSize: 16,
        lineHeight: 19
    },

    separate: {
        marginHorizontal: 12,

        height: '100%',
        width: 1,

        backgroundColor: '#CBCCD4',
        opacity: 0.5
    }
})

export default Header
