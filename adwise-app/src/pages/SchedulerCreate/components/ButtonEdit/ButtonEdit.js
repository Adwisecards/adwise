import React from 'react';
import {
    Text,
    View,
    Easing,
    Animated,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Icon
} from "native-base";

const {width, height} = Dimensions.get('window');

const ButtonEdit = (props) => {
    const {onPress, title, isEndList, isDisabled} = props;

    if (isDisabled){
        return (
            <View style={styles.containerButtonEditAbsolute}>
                <View
                    style={[
                        {...styles.buttonEditAbsolute},
                        {...styles.buttonEditAbsoluteFull}
                    ]}
                >
                    <Text style={styles.buttonEditAbsolute_Text}>Идет загрузка...</Text>
                </View>
            </View>
        )
    }

    return (
        <Animated.View style={styles.containerButtonEditAbsolute}>
            <TouchableOpacity
                style={[
                    {...styles.buttonEditAbsolute},
                    {...styles.buttonEditAbsoluteFull}
                ]}
                onPress={onPress}
            >
                <Text style={styles.buttonEditAbsolute_Text}>Создать задачу</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    containerButtonEditAbsolute: {
        paddingHorizontal: 12,
        marginBottom: 12
    },
    buttonEditAbsolute: {
        flexDirection: 'row',
        alignItems: 'center',

        justifyContent: 'center',

        borderRadius: 8,
        backgroundColor: '#8152E4',
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    buttonEditAbsoluteFull: {
        height: 40,
        justifyContent: 'center'
    },
    buttonEditAbsolute_Text: {
        fontFamily: 'AtypText_semibold',
        fontSize: 14,
        lineHeight: 14,
        color: 'white',
        textTransform: 'uppercase',
        textAlign: 'center',
        letterSpacing: 2
    },
    buttonEditAbsolute_Icon: {
        fontSize: 20,
        marginRight: 8,
        color: 'white'
    }
});

export default ButtonEdit
