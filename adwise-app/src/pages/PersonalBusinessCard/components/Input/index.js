import React from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet
} from "react-native";
import {compose} from "recompose";
import {TextInputMask} from "react-native-masked-text";
import {
    handleTextInput,
    withNextInputAutoFocusInput
} from "react-native-formik";

const InputElement = compose(
    handleTextInput,
    withNextInputAutoFocusInput
)(TextInput);
const InputElementMask = compose(
    handleTextInput,
    withNextInputAutoFocusInput
)(TextInputMask);

const Index = (props) => {

    const handleOnChange = (value) => {
        props.onChange({
            name: props.name,
            value
        });
    }

    const Element = props.useMask ? TextInputMask : InputElement;
    const LeftElements = props.leftContent || null;

    return (
        <>
            <View style={[styles.root, { ...props.root }]}>

                { Boolean(LeftElements) && (
                    <LeftElements/>
                )}

                <Element
                    {...props}

                    type="custom"
                    style={[styles.input, { ...props.style }]}

                    value={props.value || ''}
                    placeholder={props.placeholder || ''}

                    onChangeText={handleOnChange}
                />

            </View>

            {props.error && (
                <Text style={styles.error}>{ props.helperText }</Text>
            )}

        </>
    )
}

const styles = StyleSheet.create({
    root: {
        height: 50,
        paddingHorizontal: 16,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: 8,

        backgroundColor: 'white',

        flexDirection: 'row'
    },

    input: {
        flex: 1,

        fontSize: 18,
        fontFamily: 'AtypText'
    },

    error: {
        fontFamily: 'AtypText_light',
        fontSize: 12,
        color: '#F35647'
    },
});

export default Index
