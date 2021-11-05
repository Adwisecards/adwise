import React from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import getHeightStatusBar from "../../../../helper/getHeightStatusBar";

const heightStatusBar = getHeightStatusBar();

const Header = (props) => {
    const { title } = props;

    return (
        <View style={styles.root}>

            <Text style={styles.title}>{title}</Text>

        </View>
    )
};

const styles = StyleSheet.create({
   root: {
       paddingTop: heightStatusBar + 10,
       paddingHorizontal: 12,
       paddingVertical: 10,
   },

    title: {
       fontFamily: 'AtypText_medium',
        fontSize: 26,
        lineHeight: 29,
        color: '#25233E'
    }
});

export default Header
