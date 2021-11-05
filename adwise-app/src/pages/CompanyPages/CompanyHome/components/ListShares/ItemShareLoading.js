import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import axios from "../../../../../plugins/axios";
import urls from "../../../../../constants/urls";
import {
    CompanyPageBackground,
    CompanyPageLogo
} from '../../../../../icons';

const {width} = Dimensions.get('window');
const snapToInterval = width * 0.8 - 12;

class ItemShareLoading extends React.PureComponent {
    render() {
        return (
            <View style={styles.root}>
                <View style={styles.rootLeft}>

                </View>
                <View style={styles.rootRight}>
                    <View style={styles.title}/>
                    <View style={[styles.description]}/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        position: 'relative',
        overflow: 'hidden',

        marginLeft: 12,
        flexDirection: 'row',
        width: snapToInterval,

        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },

    rootLeft: {
        width: '33%',

        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    rootRight: {
        width: '77%',
        padding: 16,
        flex: 1
    },

    title: {
        width: '80%',
        height: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',

        marginBottom: 8,

        borderRadius: 3
    },
    description: {
        width: '100%',
        height: 32,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',

        borderRadius: 3
    }
});

export default ItemShareLoading
