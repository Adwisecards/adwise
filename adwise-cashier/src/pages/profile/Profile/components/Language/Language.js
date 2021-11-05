import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    IcLangRu
} from '../../../../../icons';

const Language = (props) => {
    return (
        <View style={styles.root}>
            <View style={styles.language}>
                <View style={styles.languageIcon}>
                    <IcLangRu />
                </View>
                <Text style={styles.languageTitle}>Русский</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        paddingTop: 16,

        borderTopWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E8E8E8'
    },

    language: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    languageIcon: {
        width: 30,
        height: 30,
        marginRight: 16
    },
    languageTitle: {
        fontSize: 13,
        lineHeight: 14,
        letterSpacing: 0.2,
        color: '#808080'
    },
});

export default Language