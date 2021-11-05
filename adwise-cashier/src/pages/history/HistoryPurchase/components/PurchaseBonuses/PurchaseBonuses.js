import React from "react";
import {
    View,

    Text,

    TextInput,

    StyleSheet,

    TouchableOpacity
} from 'react-native';
import {} from 'native-base';
import {formatMoney} from "../../../../../helper/format";

const PurchaseBonuses = (props) => {
    const { purchase, countBonuses, propsData, onChangeCountBonuses } = props;

    const handleOnChange = (value) => {
        let newCountBonuses = value;
        let sumInPoints = purchase.sumInPoints;
        let points = propsData.app.account.wallet.points;

        if (newCountBonuses > points) {
            newCountBonuses = points;
        }
        if (newCountBonuses >= sumInPoints){
            newCountBonuses = sumInPoints - 1;
        }

        onChangeCountBonuses(String(newCountBonuses))
    }
    const handleOnMax = () => {
        let newCountBonuses = 0;
        let sumInPoints = purchase.sumInPoints;
        let points = propsData.app.account.wallet.points;

        if (sumInPoints > countBonuses){
            newCountBonuses = points;
        } else {
            newCountBonuses = points - 1;
        }

        onChangeCountBonuses(String(newCountBonuses))
    }

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Ваши бонусы: { formatMoney(propsData.app.account.wallet.points) }</Text>

            <View style={styles.containerInput}>
                <TextInput
                    placeholder="Кол-во бонусов"
                    value={countBonuses}
                    keyboardType="number-pad"

                    style={styles.input}

                    onChangeText={handleOnChange}
                />

                <TouchableOpacity
                    style={styles.buttonMax}
                    onPress={handleOnMax}
                >
                    <Text style={styles.buttonMaxText}>Макс. { formatMoney(propsData.app.account.wallet.points) }</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.description}>
                Оплата до 99% от стоимости покупки. При вводе баллов осуществляется пересчет итоговой суммы.
            </Text>

        </View>
    )
};

const styles = StyleSheet.create({
    root: {
        marginBottom: 40
    },

    title: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: 1,

        marginBottom: 8
    },

    containerInput: {
        padding: 7,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: 8,

        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 12
    },

    input: {
        fontFamily: 'AtypText',
        fontSize: 14,
        letterSpacing: 0.5,

        flex: 1
    },

    buttonMax: {
        paddingVertical: 6,
        paddingHorizontal: 12,

        borderRadius: 4,

        backgroundColor: '#EADEFE'
    },
    buttonMaxText: {
        fontSize: 12,
        lineHeight: 14,
        color: '#966EEA'
    },

    description: {
        fontSize: 12,
        lineHeight: 13,
        opacity: 0.4,
        fontFamily: 'AtypText'
    }
});

export default PurchaseBonuses