import React from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Icon
} from 'native-base';
import {
    Input
} from '../../../../../components';

const CodeUser = (props) => {

    return (
        <View style={styles.root}>

            <Text style={styles.title}>Код пользователя</Text>

            <View style={styles.line}>

                <Input
                    style={styles.input}
                    placehodler="111-22-3331"
                    value={'111-22-333'}
                />

                <TouchableOpacity style={styles.buttonScan}>
                    <Icon
                        name="qrcode"
                        type="FontAwesome"
                        style={styles.buttonScanIcon}
                    />
                </TouchableOpacity>

            </View>

            <View style={styles.controlsContainer}>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Отправить счёт</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        marginTop: 26
    },

    title: {
        fontSize: 16,
        lineHeight: 19,
        letterSpacing: 0.2,
        color: '#25233E',
        fontFamily: 'AtypText',

        marginBottom: 8
    },

    line: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 32
    },

    input: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(168, 171, 184, 0.6)',
        borderRadius: 10,

        paddingHorizontal: 16
    },

    buttonScan: {
        backgroundColor: '#e6dcf7',

        borderRadius: 10,

        height: 48,
        width: 48,

        justifyContent: 'center',
        alignItems: 'center',

        marginLeft: 8
    },
    buttonScanIcon: {
        color: '#8152E4',
        fontSize: 25
    },

    controlsContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    button: {
        paddingHorizontal: 22,
        paddingVertical: 12,

        borderRadius: 6,

        backgroundColor: '#8152E4'
    },
    buttonText: {
        fontSize: 18,
        lineHeight: 22,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'AtypText_medium'
    }
})

export default CodeUser