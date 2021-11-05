import React, {useState} from 'react';
import {
    Icon
} from 'native-base';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from 'react-native';
import {TextInputMask} from 'react-native-masked-text'

const Input = (props) => {
    const { formik, useMask } = props;

    if (useMask) {
        return (
            <View style={styles.root}>
                <View style={styles.inputContainer}>
                    <TextInputMask
                        {...props}

                        style={[styles.input, props.style]}
                    />
                </View>
                {
                    (formik && props.error) && (
                        <Text style={styles.errorText}>{ props.error }</Text>
                    )
                }
            </View>
        )
    }

    return (
        <View style={styles.root}>
            <View style={styles.inputContainer}>
                <TextInput
                    {...props}

                    style={[styles.input, props.style]}
                />
            </View>

            {
                (formik && props.error) && (
                    <Text style={styles.errorText}>{ props.error }</Text>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },

    inputContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
    },

    input: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'transparent',

        fontFamily: 'AtypText',
        fontSize: 20
    },

    errorText: {
        fontSize: 12,
        marginTop: 2,
        color: '#F35647'
    }
});

Input.defaultProps = {
    placeholderColor: '#D1D1D1'
};

export default Input
