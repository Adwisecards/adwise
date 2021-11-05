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

const Header = (props) => {
    const {
        organizationName,
        organizationColor,
        categoryName,

        routeGoBack
    } = props;

    return (
        <View style={styles.root}>

            <Text style={[styles.organizationName, {color: organizationColor}]}>{organizationName}</Text>

            <TouchableOpacity style={styles.buttonGoBack} onPress={routeGoBack}>
                <Icon name="arrow-left" type="Feather" style={{ color: organizationColor }}/>

                <Text style={styles.buttonGoBackText}>{categoryName}</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: 12,
        paddingVertical: 12
    },

    organizationName: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        marginBottom: 8
    },

    buttonGoBack: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonGoBackText: {
        fontFamily: 'AtypText_medium',
        fontSize: 26,
        lineHeight: 26,
        color: 'black',
        marginLeft: 14
    }
})

export default Header
