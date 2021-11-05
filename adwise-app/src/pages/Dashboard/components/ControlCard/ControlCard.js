import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

const ControlCard = (props) => {
    const {onPress, Icon, title, active} = props;

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.root, active && styles.rootActive]}>
                <Image
                    style={[styles.icon, active && styles.rootIconActive]}
                    source={Icon}
                />

                <Text style={[styles.title, , active && styles.rootTitleActive]} numberOfLines={1}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        marginLeft: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        backgroundColor: 'white',

        minHeight: 55
    },

    rootActive: {
        backgroundColor: '#8152E4',
    },

    icon: {
        width: 20,
        height: 20,
        marginBottom: 4,
        tintColor: '#8152E4'
    },
    rootIconActive: {
        tintColor: 'white'
    },

    title: {
        fontSize: 12,
        opacity: 0.6,
        fontFamily: 'AtypText_medium'
    },
    rootTitleActive: {
        color: 'white',
        opacity: 1
    }
})

export default ControlCard
