import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from "react-native";

const Language = (props) => {
    const {item, languageListCount} = props;

    const Icon = item.icon;

    return (
        <View>
            <TouchableHighlight
                activeOpacity={1}
                underlayColor="rgba(0, 0, 0, 0)"


                onPress={() => props.onSetLanguage(item.key)}
            >
                <View style={styles.root}>
                    <View style={styles.iconContainer}>
                        {
                            Boolean(Icon) && (
                                <Icon/>
                            )
                        }
                    </View>

                    <Text style={styles.title}>{ item.title }</Text>
                </View>
            </TouchableHighlight>

            <View style={styles.separate}/>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 8
    },

    iconContainer: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 16
    },

    title: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 18
    },

    separate: {
        width: '100%',
        height: 1,
        backgroundColor: '#E8E8E8',

        marginVertical: 8
    }
});

export default Language
