import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import {
    Icon
} from 'native-base';
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import { UserSmall } from '../../icons';

const UserSmallCard = (props) => {
    return (
        <View style={styles.card}>

            <View style={styles.cardImage}/>

            <View style={styles.cardContent}>

                <View style={styles.title}/>

                <View style={styles.description}/>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',

        backgroundColor: 'white',

        borderRadius: 10
    },

    cardImage: {
        width: '33%',
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },

    cardContent: {
        flex: 1,
        padding: 12
    },

    title: {
        width: '80%',
        height: 16,

        borderRadius: 3,

        marginBottom: 4,

        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    description: {
        width: '100%',
        height: 32,

        borderRadius: 3,

        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
});

export default UserSmallCard
