import React from 'react';
import {
    Image,
    StyleSheet, Text,
    TouchableOpacity, View
} from 'react-native';

const ButtonControl = (props) => {
    const {Icon, title} = props;

    return (
        <TouchableOpacity onPress={props.onPress} style={styles.button}>

            <View style={styles.buttonIconContainer}>
                <Icon/>
            </View>

            <Text style={styles.buttonText}>{ title }</Text>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 8,

        backgroundColor: 'white',

        borderRadius: 4,

        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonIconContainer: {
        width: 20,
        height: 20,

        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 4
    },
    buttonIcon: {},

    buttonText: {
        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 12,
        opacity: 0.6
    },
});

export default ButtonControl
