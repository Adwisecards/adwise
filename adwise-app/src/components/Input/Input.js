import React, {useState} from 'react';
import {
    Icon,
    Input as InputDefault
} from 'native-base';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {TextInputMask} from 'react-native-masked-text'

const Input = (props) => {
    const {
        styleInput, placeholderTextColor, stylePlaceholder,
        useMask, onChangeText, useCustomStylePlaceholder,
        styleContainer, rightChildren, typeContainer,
        secureTextEntry, onChangeSecureTextEntry, formik,
        required
    } = props;
    const [showStylesPlaceholder, setShowStylesPlaceholder] = useState(true);

    const handleChangeText = (value) => {
        setShowStylesPlaceholder(value.length <= 0);

        if (onChangeText){
            onChangeText(value)
        }
    }
    const handleChangeSecureTextEntry = () => {
        onChangeSecureTextEntry(!secureTextEntry)
    }

    if (useMask) {
        return (
            <View>
                <View style={[styles.container, styleContainer]}>
                    <TextInputMask
                        placeholderTextColor={placeholderTextColor}

                        type={(props.type) ? props.type : 'custom'}

                        {...props}

                        style={[styles.root, styleInput, (showStylesPlaceholder && useCustomStylePlaceholder) && stylePlaceholder]}
                        onChangeText={handleChangeText}
                    />
                    {rightChildren}
                </View>
                {
                    (formik && props.error) && (
                        <Text style={styles.errorText}>{ props.error }</Text>
                    )
                }
            </View>
        )
    }

    if (typeContainer) {
        return (
            <View>
                <View style={[styles.container, styles.сontainerPassword, styleContainer]}>
                    <InputDefault
                        placeholderTextColor={placeholderTextColor}

                        {...props}


                        style={[styles.root, styles.rootPassword, styleInput]}
                    />

                    <TouchableOpacity style={styles.buttonPassword} onPress={handleChangeSecureTextEntry}>
                        <Icon name={ secureTextEntry ? 'eye-off' : 'eye' } type={'Feather'} style={{ color: '#DADADA', fontSize: 20 }}/>
                    </TouchableOpacity>
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
        <View>
            <View style={[styles.container, styleContainer]}>
                <InputDefault
                    placeholderTextColor={placeholderTextColor}

                    {...props}

                    style={[styles.root, styleInput, (showStylesPlaceholder && useCustomStylePlaceholder) && stylePlaceholder]}

                    onChangeText={handleChangeText}
                />
                {rightChildren}
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
        fontFamily: 'AtypText',
        width: '100%',
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',

        paddingLeft: 14,
        paddingRight: 14,
    },
    rootPassword: {
        height: 40,
        fontSize: 20,
        lineHeight: 38,
        paddingHorizontal: 16,
        borderWidth: 0,
    },

    container: {
        width: '100%',
        minHeight: 50
    },
    сontainerPassword: {
        flexDirection: 'row',
        minHeight: 40,
        width: '100%',
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        paddingRight: 16,
    },

    buttonPassword: {
        width: 40,
        height: 40,
        marginRight: -10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    errorText: {
        fontSize: 12,
        marginTop: 2,
        color: '#F35647'
    },
});

Input.defaultProps = {
    useMask: false,
    useCustomStylePlaceholder: false,
    placeholderTextColor: 'rgba(0, 0, 0, 0.4)'
};

export default Input
