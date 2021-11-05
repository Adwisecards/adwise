import React, {useState} from 'react';
import {
    View,
    Text,
    Image,
    StatusBar,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableOpacity, Platform
} from 'react-native';
import {
    Icon
} from 'native-base';
import i18n from 'i18n-js';
import {compose} from "recompose";
import {connect} from "react-redux";
import {
    Search,
    MapPoint
} from "../../../../icons";
import { LinearGradient } from 'expo-linear-gradient';
import getHeightStatusBar from "../../../../helper/getHeightStatusBar";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";


const {width, height} = Dimensions.get('window');
const heightStatusBar = getHeightStatusBar();

const Header = (props) => {
    const {navigation} = props;

    const currentCity = props?.app?.account?.address?.city || allTranslations(localization.commonCurrentCityEmpty);

    const handleOpenSelectedCity = () => {
        navigation.navigate('CitySelection')
    }

    return (
        <View style={styles.root}>

            <TouchableOpacity style={[styles.button, styles.buttonCity]} onPress={handleOpenSelectedCity}>
                <View style={styles.buttonIconContainer}>
                    <MapPoint/>
                </View>

                <Text style={styles.buttonCityText} numberOfLines={1}>
                    <Text style={{textTransform: "uppercase"}}>{currentCity[0]}</Text>{currentCity.slice(1)}
                </Text>

                <LinearGradient
                    colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.5)']}
                    style={styles.buttonRightGradient}
                    start={{ x: 0.7, y: 0 }}
                    end={{ x: 0, y: 0 }}
                />
            </TouchableOpacity>

        </View>
    )
}

Header.defaultProps = {
    showHeader: false
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        paddingHorizontal: 12,
        flexDirection: 'row',
        overflow: 'hidden',

        paddingTop: heightStatusBar + 8,

        marginLeft: -12,
        marginBottom: 4
    },

    button: {
        marginLeft: 12,

        paddingHorizontal: 10,
        paddingVertical: 11,

        backgroundColor: '#FFFFFF',

        borderRadius: 4,

        flexDirection: 'row',
        alignItems: 'center',

        position: 'relative',

        overflow: 'hidden'
    },
    buttonIconContainer: {
        width: 15,
        height: 15,

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 8
    },
    buttonIcon: {},

    buttonCity: {
        flex: 1,

        paddingRight: 0
    },
    buttonCityText: {
        flex: 1,

        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 17,
        opacity: 0.6
    },

    buttonSearch: {},
    buttonSearchText: {
        fontFamily: 'AtypText',
        fontSize: 12,
        lineHeight: 17,
        textAlign: 'center',
        opacity: 0.4
    },

    buttonRightGradient: {
        right: 0,
        top: 0,

        width: 30,
        height: 39,
        position: 'absolute'
    },
})

export default compose(
    connect(
        state => ({
            app: state.app
        })
    ),
)(Header);
