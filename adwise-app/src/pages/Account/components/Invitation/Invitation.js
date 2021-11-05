import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';

import logo from '../../../../../assets/graphics/account/account_logo.png';
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const Invitation = (props) => {
    return (
        <View style={styles.root}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={logo} resizeMode={'contain'}/>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{allTranslations(localization.accountInvitationTitle)}</Text>
                <Text style={styles.description}>{allTranslations(localization.accountInvitationDescription)}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 12
    },

    logo: {
        width: 40,
        height: 40,
        borderRadius: 999,
        flex: 1,
    },
    logoContainer: {
        marginRight: 22
    },

    title: {
        fontFamily: 'AtypText',
        fontSize: 18,
        color: 'black',
        letterSpacing: 0.1
    },
    description: {
        fontFamily: 'AtypText',
        fontSize: 12,
        opacity: 0.6
    }
})

export default Invitation
