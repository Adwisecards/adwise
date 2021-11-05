import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';

import {
    IconVk,
    IconApple,
    IconGoogle,
    IconFaceBook
} from '../../../../icons';

const Item = (props) => {
    const { onPress, Icon } = props;

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.buttonSocial}>
                <Icon/>
            </View>
        </TouchableWithoutFeedback>
    )
}

const Socials = (props) => {

    return (
        <View style={styles.container}>
            <Item Icon={IconGoogle}/>
            <Item Icon={IconFaceBook}/>
            <Item Icon={IconVk}/>
            <Item Icon={IconApple}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',

        justifyContent: 'space-between'
    },

    buttonSocial: {
        position: 'relative',
        overflow: 'hidden',

        width: 54,
        height: 54,
        borderRadius: 999,
        backgroundColor: 'white',
        padding: 12
    }
});

export default Socials
