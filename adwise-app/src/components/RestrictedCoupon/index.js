import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";

const cigarettes = "Курение вредит вашему здоровью. Приобретение табачной продукции осуществляется только в торговом зале магазина";
const alcohol = "Чрезмерное употребление алкогольной продукции вредит вашему здоровью. Приобретение алкогольной продукции осуществляется только в торговом зале магазин";

const RestrictedCoupon = (props) => {
    const {type, onCancel, onSubmit} = props;

    const _getMessage = () => {
        if (type === 'cigarettes') {
            return cigarettes
        }
        if (type === 'alcohol') {
            return alcohol
        }
    }

    return (
        <View style={styles.root}>

            <Text style={styles.title}>Вам есть 18 лет?</Text>

            <View style={styles.buttons}>
                <TouchableOpacity style={styles.button} onPress={onSubmit}>
                    <Text style={styles.buttonText}>Да</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onCancel}>
                    <Text style={styles.buttonText}>Нет</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <Text style={styles.containerText}>
                    {_getMessage()}
                </Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        position: "absolute",
        left: 12,
        top: 20,
        right: 12,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",

        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'white',

        borderTopRightRadius: 7,
        borderTopLeftRadius: 7,

        paddingHorizontal: 28,
        paddingVertical: 95
    },
    title: {
        fontFamily: 'AtypText_medium',
        fontSize: 24,
        lineHeight: 29,
        color: 'white',
        textAlign: 'center',
        marginBottom: 18
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -24,
        marginBottom: 90
    },
    button: {
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0184FF',
        borderRadius: 6,
        paddingHorizontal: 32,
        marginLeft: 24
    },
    buttonText: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 18,
        color: '#FFFFFF'
    },

    container: {
        borderWidth: 5,
        borderStyle: 'solid',
        borderColor: '#FFFFFF',
        borderRadius: 5,

        padding: 10,
    },
    containerText: {
        fontFamily: 'AtypText_semibold',
        fontSize: 15,
        lineHeight: 19,
        color: 'white',
        textAlign: 'center',
        textTransform: "uppercase"
    }
});

export default RestrictedCoupon
