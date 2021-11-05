import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import localization from "../../../../localization/localization";
import allTranslations from "../../../../localization/allTranslations";

const HeaderSwitch = (props) => {
    const { active, onChange } = props;

    const handleRoute = (path) => {
        onChange(path)
    }

    return (
        <View style={styles.root}>
            <View style={styles.navigations}>
                <TouchableOpacity style={[styles.navigation]} onPress={() => handleRoute(0)}>
                    <Text style={[styles.navigationText, active === 0 && styles.navigationTextActive]}>
                        {allTranslations(localization.financialSectionHeaderSwitchFinancialSection)}
                    </Text>

                    { active === 0 && ( <View style={styles.lineActive}/> ) }

                </TouchableOpacity>

                <TouchableOpacity style={[styles.navigation]} onPress={() => handleRoute(1)}>
                    <Text style={[styles.navigationText, active === 1 && styles.navigationTextActive]}>
                        {allTranslations(localization.financialSectionHeaderSwitchReferralProgram)}
                    </Text>

                    { active === 1 && ( <View style={styles.lineActive}/> ) }
                </TouchableOpacity>

                <View style={styles.bottomLine}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: 12,
        flexDirection: 'column',
        alignItems: 'flex-start',

        marginBottom: 12
    },

    navigations: {
        flexDirection: 'row',
        marginLeft: -32,

        position: 'relative'
    },

    navigation: {
        marginLeft: 32,
        position: 'relative',

        paddingBottom: 18,

        zIndex: 1
    },
    navigationText: {
        fontSize: 20,
        lineHeight: 22,
        opacity: 0.5,
        fontFamily: 'AtypText'
    },
    navigationTextActive: {
        opacity: 1,
    },

    lineActive: {
        height: 5,
        backgroundColor: '#ED8E00',

        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },

    bottomLine: {
        height: 1,
        backgroundColor: '#CECECE',

        position: 'absolute',
        left: 32,
        right: 0,
        bottom: 0
    },
});

export default HeaderSwitch
