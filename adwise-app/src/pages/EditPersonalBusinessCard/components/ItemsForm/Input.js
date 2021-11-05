import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Input as InputCustom
} from '../../../../components'
import {
    Icon
} from 'native-base'

const ButtonClear = (props) => {
    return (
        <TouchableOpacity style={styles.buttonClear}>
            <Icon name={'clear'} style={styles.buttonClear__Icon} type={'MaterialIcons'}/>
        </TouchableOpacity>
    )
}

const Input = (props) => {
    const { title, errorMessage, isError } = props;

    return (
        <View style={styles.root}>
            <Text style={styles.title}>{ title }</Text>

            <InputCustom
                {...props}

                styleContainer={styles.styleContainer}
                styleInput={styles.styleInput}
                rightChildren={(<ButtonClear/>)}
            />

            {
                isError && (
                    <Text style={styles.errorMessage}>{ errorMessage }</Text>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    root: {},

    title: {
        marginBottom: 8,
        fontSize: 16,
        lineHeight: 18,
        opacity: 0.6
    },

    errorMessage: {
        fontSize: 12,
        marginTop: 2,
        color: '#F35647'
    },

    styleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingRight: 2,
        backgroundColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
    },
    styleInput: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        flex: 1,
        fontSize: 18
    },

    buttonClear: {
        width: 40,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonClear__Icon: {
        fontSize: 23,
        opacity: 0.13
    }
});

export default Input
