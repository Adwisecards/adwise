import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import {
    Icon
} from 'native-base';
import * as Linking from 'expo-linking';

const {width} = Dimensions.get('window');

const widthButton = width / 3;

const Socials = (props) => {
    const {socialNetworks} = props;

    const showButtonFb = !!socialNetworks.fb.value;
    const showButtonInsta = !!socialNetworks.insta.value;
    const showButtonVk = !!socialNetworks.vk.value;

    const handleOpenFb = () => {
        Linking.openURL(socialNetworks.fb.value)
    }
    const handleOpenInsta = () => {
        Linking.openURL(socialNetworks.insta.value)
    }
    const handleOpenVk = () => {
        Linking.openURL(socialNetworks.vk.value)
    }

    if (!showButtonFb && !showButtonInsta && !showButtonVk){
        return null
    }

    return (
        <View style={styles.root}>
            {
                (showButtonFb) && (
                    <TouchableOpacity style={styles.socialButton} onPress={handleOpenFb}>
                        <View style={styles.containerIcon}>
                            <Icon name={'facebook'} type={"MaterialCommunityIcons"} style={styles.socialIcon}/>
                        </View>
                    </TouchableOpacity>
                )
            }

            {
                (showButtonVk || true) && (
                    <TouchableOpacity style={styles.socialButton} onPress={handleOpenVk}>
                        <View style={styles.containerIcon}>
                            <Icon name={'vk'} type={"MaterialCommunityIcons"} style={styles.socialIcon}/>
                        </View>
                    </TouchableOpacity>
                )
            }

            {
                (showButtonInsta) && (
                    <TouchableOpacity style={styles.socialButton} onPress={handleOpenInsta}>
                        <View style={styles.containerIcon}>
                            <Icon name={'instagram'} type={"MaterialCommunityIcons"} style={styles.socialIcon}/>
                        </View>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginBottom: 24
    },

    socialButton: {
        width: widthButton - 14,
        height: 80,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: 'white'
    },
    socialIcon: {
        color: 'white',
        fontSize: 25
    },

    containerIcon: {
        width: 40,
        height: 40,
        borderRadius: 999,

        padding: 6,

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: 'rgba(237, 142, 0, 0.8)'
    },
});

Socials.defaultProps = {
    socialNetworks: {
        "fb": {
            "value": ""
        },
        "insta": {
            "value": ""
        },
        "vk": {
            "value": ""
        }
    }
};

export default Socials