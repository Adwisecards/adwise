import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {
    Icon
} from "native-base";

const BonusPayment = (props) => {
    const { usedPoints, points, maxAmount, onChange, isHide } = props;

    const [isOpen, setOpen] = useState(false);

    if (isHide) {
        return null
    }

    if (!isOpen) {
        return (
            <View style={styles.root}>

                <TouchableOpacity style={styles.buttonOpenForm} onPress={() => setOpen(true)}>
                    <Text style={styles.title}>Оплата бонусами</Text>
                    <View style={styles.buttonOpenFormIcon}>
                        <Icon type="Feather" name="plus" style={{color: 'white', fontSize: 16}}/>
                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    const handleOnChange = (value) => {
        if (!value) {
            onChange('');

            return null
        }

        let newValue = parseInt(value.replace(/\D+/g,""));

        if (!newValue) {
            onChange('');

            return null
        }

        if (newValue > maxAmount) {
            newValue = maxAmount;
        }

        onChange(newValue);
    }

    console.log('points: ', points);

    return (
        <View style={styles.root}>

            <Text style={[styles.title, {marginBottom: 10}]}>Ваши бонусы: {points}</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    value={String(usedPoints)}
                    style={styles.inputTextInput}
                    placeholder="Количество бонусов"
                    keyboardType="numeric"
                    onChangeText={handleOnChange}
                />

                <TouchableOpacity style={styles.buttonAll} onPress={() => handleOnChange(String(maxAmount))}>
                    <Text style={styles.buttonAllText}>Макс. {maxAmount}</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.message}>Оплата до 99% от стоимости покупки. При вводе баллов осуществляется пересчет итоговой суммы</Text>

        </View>
    )
};

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

    buttonAll: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: '#EADEFE',
        borderRadius: 3
    },
    buttonAllText: {
        fontFamily: 'AtypDisplay',
        fontSize: 12,
        lineHeight: 12,
        color: '#966EEA'
    },

    message: {
        fontFamily: 'AtypText',
        fontSize: 11,
        lineHeight: 12,
        color: '#808080',
        opacity: 0.5
    }
});

export default BonusPayment
