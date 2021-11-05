import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
} from "react-native";
import allTranslations from "../../localization/allTranslations";

const LineTabs = (props) => {
    const {tabs, active, onChangeTab} = props;

    return (
        <View style={styles.root}>

            <View style={styles.container}>

                {
                    tabs.map((tab, idx) => {

                        const label = allTranslations(tab.label) || '';

                        return (
                            <TouchableHighlight
                                key={`tab-button-${ tab.name }-${ tab.idx }`}
                                onPress={() => onChangeTab(tab.name)}
                            >
                                <View style={[styles.buttonElement, active === tab.name && styles.buttonElementActive, idx > 0 && styles.buttonElementMargin]}>
                                    <Text style={[styles.buttonTextElement, active === tab.name && styles.buttonTextElementActive]}>
                                        {label}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        )
                    })
                }

            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    root: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',

        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#CECECE'
    },

    buttonElement: {
        marginBottom: -1,

        borderBottomWidth: 4,
        borderStyle: 'solid',
        borderColor: 'transparent',

        paddingBottom: 4
    },
    buttonElementMargin: {
        marginLeft: 16
    },
    buttonElementActive: {
        borderBottomWidth: 4,
        borderStyle: 'solid',
        borderColor: '#8152E4'
    },
    buttonTextElement: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 20,
        opacity: 0.5
    },
    buttonTextElementActive: {
        opacity: 1
    },
});

LineTabs.defaultProps = {
    tabs: [],

    onChangeTab: function () {
    }
};

export default LineTabs
