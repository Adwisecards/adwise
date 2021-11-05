import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import * as Linking from 'expo-linking';
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const Application = (props) => {

    const handleOpenWeb = () => {
        Linking.openURL("https://adwise.cards/");
    }

    return (
        <View style={styles.root}>
            <Text style={styles.title}>{allTranslations(localization.accountApplicationDescription)}</Text>

            <TouchableOpacity style={styles.button} onPress={handleOpenWeb}>
                <Text style={styles.buttonText}>{allTranslations(localization.accountApplicationButton)}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: 'white',
        borderRadius: 10,

        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#a785ec'
    },

    title: {
        textAlign: 'center',
        fontFamily: 'AtypText_semibold',
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: 0.01,

        marginBottom: 16
    },

    button: {
        paddingHorizontal: 40,
        paddingVertical: 10,
        backgroundColor: '#8152E4',
        borderRadius: 10
    },
    buttonText: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 18,
        color: 'white'
    },
});

export default Application
