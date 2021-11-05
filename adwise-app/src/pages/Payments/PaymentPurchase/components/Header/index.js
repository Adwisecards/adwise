import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {
    Icon
} from "native-base";
import getHeightStatusBar from "../../../../../helper/getHeightStatusBar";

const heightStatusBar = getHeightStatusBar();

const Header = (props) => {
    const {status, order, goBack} = props;

    const handleGetTitle = () => {
        switch (status) {
            case "not-paid": {
                return 'Неоплачен'
            }
            case "shared": {
                return 'Подарок'
            }
            case "paid": {
                return 'Оплачен'
            }
            case "during": {
                return 'Ожидание оплаты'
            }
            case "canceled": {
                return 'Возврат'
            }
            case "completed": {
                return 'Завершён'
            }
        }
    }

    return (
        <View style={styles.root}>

            <TouchableOpacity style={styles.buttonBack} onPress={goBack}>
                <Icon type="Feather" name="arrow-left" style={styles.buttonBackIcon}/>
            </TouchableOpacity>

            <Text style={styles.title}>Заказ №{order}</Text>

            <View style={[
                styles.status,
                Boolean(status === 'not-paid') && styles.statusNotPaid,
                Boolean(status === 'paid') && styles.statusPaid,
                Boolean(status === 'during') && styles.statusWaitingPayment,
                Boolean(status === 'canceled') && styles.statusShared,
                Boolean(status === 'completed') && styles.statusCompleted,
                Boolean(status === 'shared') && styles.statusShared,
            ]}>
                <Text style={[styles.statusText]}>{handleGetTitle()}</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: 12,
        paddingTop: 12 + heightStatusBar,
        paddingBottom: 12,

        backgroundColor: 'white',

        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,

        elevation: 2,

        flexDirection: "row",
        alignItems: 'center'
    },

    buttonBack: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30
    },
    buttonBackIcon: {
        color: '#8152E4',
        fontSize: 24
    },

    title: {
        marginLeft: 16,
        fontFamily: 'AtypText_medium',
        fontSize: 17,
        lineHeight: 17,
        color: '#25233E'
    },

    status: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 36,
        marginLeft: 'auto'
    },
    statusNotPaid: {
        backgroundColor: '#D8004E'
    },
    statusPaid: {
        backgroundColor: '#61AE2C'
    },
    statusWaitingPayment: {
        backgroundColor: '#ED8E00'
    },
    statusShared: {
        backgroundColor: '#02D1C5'
    },
    statusCompleted: {
        backgroundColor: '#8152E4'
    },
    statusText: {
        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 12,
        color: 'white'
    }
});

export default Header
