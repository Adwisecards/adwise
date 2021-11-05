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
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const PurchaseBonuses = (props) => {
    const { purchase, countBonuses, propsData, onChangeCountBonuses } = props;
    const { wallet } = propsData.app;

    const handleOnChange = (value) => {
        if (Number(value) <= 0 || !Number(value)) {
            value = ""
        }

        let newCountBonuses = value;
        let sumInPoints = purchase.sumInPoints;
        let points = wallet.points;

        if (newCountBonuses > points) {
            newCountBonuses = points;
        }
        if (newCountBonuses >= sumInPoints){
            newCountBonuses = sumInPoints - 1;
        }

        if (newCountBonuses !== '') {
            newCountBonuses = Math.floor(newCountBonuses);
        }

        onChangeCountBonuses(String(newCountBonuses))
    }
    const handleOnMax = () => {
        let newCountBonuses = wallet.points;
        let sumInPoints = purchase.sumInPoints;
        let points = wallet.points;

        if (newCountBonuses > points) {
            newCountBonuses = points;
        }
        if (newCountBonuses >= sumInPoints){
            newCountBonuses = sumInPoints - 1;
        }

        if (newCountBonuses !== '') {
            newCountBonuses = Math.floor(newCountBonuses);
        }

        onChangeCountBonuses(String(newCountBonuses))
    }

    return (
        <View style={styles.root}>
            <Text style={styles.title}>{ allTranslations(localization.purchaseBonusesMyBonus, { count: formatMoney(wallet.points) }) }</Text>

            <View style={styles.containerInput}>
                <TextInput
                    placeholder={ allTranslations(localization.purchaseBonusesPlaceholder) }
                    value={countBonuses}
                    keyboardType="number-pad"

                    style={styles.input}

                    onChangeText={handleOnChange}
                />

                <TouchableOpacity
                    style={styles.buttonMax}
                    onPress={handleOnMax}
                >
                    <Text style={styles.buttonMaxText}>{ allTranslations(localization.purchaseBonusesButtonMax, {count: formatMoney(wallet.points)}) }</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.description}>
                { allTranslations(localization.purchaseBonusesHint) }
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
