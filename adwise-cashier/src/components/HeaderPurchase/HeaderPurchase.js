import React from "react";
import {
    View,

    Text,

    StyleSheet,

    TouchableOpacity
} from 'react-native';
import {
    Icon
} from 'native-base';

const HeaderPurchase = (props) => {
    const handleGoBack = () => {
        if (!props.navigation){
            return null
        }

        props.navigation.goBack();
    }

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Icon name="arrow-left" type="Feather" style={styles.backIcon}/>
            </TouchableOpacity>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>{ props.title }</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 30,
        paddingVertical: 12
    },

    backButton: {
        width: 40,
        height: 40,

        marginLeft: -5,

        justifyContent: 'center',
        alignItems: 'center'
    },
    backIcon: {
        fontSize: 25,
        color: '#8152E4'
    },

    titleContainer: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 40
    },
    title: {
        fontFamily: 'AtypDisplay',
        fontSize: 18,
        lineHeight: 22,
        letterSpacing: 1,
        textAlign: 'center'
    }
});

export default HeaderPurchase