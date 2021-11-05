import React, {useState} from "react";
import {
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import {Icon} from "native-base";

const FormComment = (props) => {
    const { value, onChange, isHide } = props;

    const [isOpen, setOpen] = useState(false);

    if (isHide) {
        return null
    }

    if (!isOpen) {
        return (
            <View style={styles.root}>

                <TouchableOpacity style={styles.buttonOpenForm} onPress={() => setOpen(true)}>
                    <Text style={styles.title}>Добавить комментарий</Text>
                    <View style={styles.buttonOpenFormIcon}>
                        <Icon type="Feather" name="plus" style={{color: 'white', fontSize: 16}}/>
                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    return (
        <View style={styles.root}>

            <Text style={[styles.title, {marginBottom: 10}]}>Комментарий</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    value={value}
                    multiline
                    style={styles.inputTextInput}
                    placeholder="Желаемые условия доставки и т.д."
                    onChangeText={onChange}
                />
            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    root: {
        marginBottom: 24
    },
    title: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 20,
        color: '#25233E'
    },

    buttonOpenForm: {
        flexDirection: "row",
        alignItems: "center"
    },
    buttonOpenFormIcon: {
        marginLeft: 8,
        width: 20,
        height: 20,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ED8E00'
    },

    inputContainer: {
        flexDirection: 'row',

        height: 40,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: 8,

        padding: 6,
        overflow: 'hidden',

        marginBottom: 8
    },
    inputTextInput: {
        flex: 1,
        paddingHorizontal: 8,
        fontFamily: 'AtypText',
        fontSize: 14
    },
})

export default FormComment
