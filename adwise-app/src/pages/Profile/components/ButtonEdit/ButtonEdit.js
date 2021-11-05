import React from 'react';
import {
    Text,
    Easing,
    Animated,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Icon
} from "native-base";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const {width, height} = Dimensions.get('window');

const ButtonEdit = (props) => {
    const {navigation} = props;

    const handleToEdit = () => {
        navigation.navigate('ProfileEdit')
    }

    return (
        <Animated.View style={styles.containerButtonEditAbsolute}>
            <TouchableOpacity
                style={[
                    {...styles.buttonEditAbsolute}
                ]}
                onPress={handleToEdit}
            >
                <Icon name={'pencil-outline'} style={styles.buttonEditAbsolute_Icon} type={'MaterialCommunityIcons'}/>
                <Text style={styles.buttonEditAbsolute_Text}>{ allTranslations(localization.profileEdit) }</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    containerButtonEditAbsolute: {
        position: 'absolute',
        right: 12,
        bottom: 12,

        width: 'auto',

        alignItems: 'flex-end'
    },
    buttonEditAbsolute: {
        flexDirection: 'row',
        alignItems: 'center',

        borderRadius: 20,
        backgroundColor: '#8152E4',
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    buttonEditAbsoluteFull: {
        width: '100%',
        borderRadius: 10,
        height: 40,
        justifyContent: 'center'
    },
    buttonEditAbsolute_Text: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 14,
        color: 'white'
    },
    buttonEditAbsolute_Icon: {
        fontSize: 20,
        marginRight: 8,
        color: 'white'
    }
});

export default ButtonEdit
