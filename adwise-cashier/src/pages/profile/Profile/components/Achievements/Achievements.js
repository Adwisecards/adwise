import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    AchievementsIcon
} from '../../../../../icons';

const Achievements = () => {

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <View style={styles.headerIcon}>
                    <AchievementsIcon />
                </View>
                <Text style={styles.headerTitle}>Достижения</Text>
            </View>

            <View style={styles.item}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {},

    header: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 24
    },
    headerIcon: {
        width: 50,
        height: 50,
        marginRight: 16
    },
    headerTitle: {
        fontFamily: 'AtypText',
        fontSize: 15,
        lineHeight: 17,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        color: '#808080'
    }
})

export default Achievements