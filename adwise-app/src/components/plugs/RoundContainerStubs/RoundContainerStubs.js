import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

const RoundContainerStubs = (props) => {
    const { styleRoot, children } = props;

    return (
        <View style={[styles.root, styleRoot]}>
            { children }
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        borderRadius: 999,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.2,
        elevation: 3,
    }
})

export default RoundContainerStubs