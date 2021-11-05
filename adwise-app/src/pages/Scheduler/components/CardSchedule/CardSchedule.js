import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Icon
} from 'native-base';
import moment from "moment";

const CardSchedule = (props) => {
    const { styleCard, removeItem } = props;

    const handleOpenView = () => {
        props.navigation.navigate('SchedulerInformation', {
            id: props._id
        })
    }

    return (
        <TouchableOpacity style={[styles.card]} onPress={handleOpenView}>
            <View style={styles.card_Header}>
                <Text style={styles.card_Date}>{ moment(props.date).format('DD MMMM YYYY') }</Text>

                <TouchableOpacity style={styles.card_ButtonDelete} onPress={() => removeItem(props._id)}>
                    <Icon name={'close'} style={styles.card_ButtonDeleteIcon}/>
                </TouchableOpacity>
            </View>
            <View style={styles.card_Body}>
                <Text style={styles.card_Title}>{ props.name }</Text>
                <Text style={styles.card_Description}>{ props.description }</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 12
    },

    card_Header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 12
    },
    card_Body: {},

    card_Date: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 20,
        color: '#8152E4'
    },

    card_ButtonDelete: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 20,
        width: 46,
        height: 46,
        padding: 16,

        margin: -16,
        marginTop: -22,

        // backgroundColor: 'red',

        justifyContent: 'center',
        alignItems: 'center'
    },
    card_ButtonDeleteIcon: {
        fontSize: 20,
        opacity: 0.13
    },

    card_Title: {
        fontFamily: 'AtypText_semibold',
        fontSize: 20,
        lineHeight: 22
    },
    card_Description: {
        fontSize: 16,
        opacity: 0.7
    }
})

export default CardSchedule
