import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import {
    Icon
} from 'native-base';
import getHeightStatusBar from "../../helper/getHeightStatusBar";

const heightStatusBar = getHeightStatusBar();

const Header = (props) => {
    const {
        title, disabledButton,
        styleTitle,styleContainer
    } = props;

    const handleGoBack = () => {
        props.navigation.goBack()
    }

    if (disabledButton) {
        return (
            <View style={[styles.root, styleContainer]}>
                <View style={styles.center}>
                    <Text style={[styles.title, styleTitle]}>{ title }</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={[styles.root, styleContainer]}>
            <View style={styles.left}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon name={'arrow-left'} style={{color: '#8152E4'}} type={'Feather'}/>
                </TouchableOpacity>
            </View>
            <View style={styles.center}>
                <Text style={[styles.title, styleTitle]}>{ title }</Text>
            </View>
            <View style={styles.right}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        overflow: 'hidden',

        marginTop: heightStatusBar,

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 30,
        paddingVertical: 24
    },

    left: {
        margin: -12,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    right: {
        width: 30,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center'
    },
    center: {
        flex: 1
    },

    title: {
        textAlign: 'center',

        fontFamily: 'AtypText',
        fontSize: 24,
        lineHeight: 26,
    }
})

export default Header
