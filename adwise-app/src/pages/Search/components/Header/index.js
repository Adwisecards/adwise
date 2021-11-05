import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    Icon
} from "native-base";
import getHeightStatusBar from "../../../../helper/getHeightStatusBar";

const heightStatusBar = getHeightStatusBar();

const Header = (props) => {
    const { goBack } = props;

    return (
        <View style={styles.root}>

            <TouchableOpacity style={styles.buttonBack} onPress={goBack}>
                <Icon
                    name="arrow-left"
                    type="Feather"
                    style={styles.buttonBackIcon}
                />
            </TouchableOpacity>

            <Text style={styles.title}>Организации</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        paddingTop: 10 + heightStatusBar,
        paddingHorizontal: 12,
        paddingVertical: 10,

        flexDirection: 'row',
        alignItems: 'center'
    },

    buttonBack: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -8,
        marginRight: 4
    },
    buttonBackIcon: {
        fontSize: 25,
        color: '#8152E4'
    },

    title: {
        fontFamily: 'AtypText_medium',
        fontSize: 26,
        lineHeight: 26,
        color: '#25233E',
        marginBottom: -2
    }
});

export default Header
