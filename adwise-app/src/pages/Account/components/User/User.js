import React from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Clipboard
} from 'react-native';
import {
    Icon
} from 'native-base';
import {
    PersonalSmallCard
} from '../../../../icons';
import {DropDownHolder} from "../../../../components";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const User = (props) => {
    const {account, navigation} = props;

    const handleToProfile = () => {
        navigation.navigate('Profile')
    }
    const handleCopyCode = (code) => {
        Clipboard.setString(code);

        DropDownHolder.alert(
            'success',
            allTranslations(localization.notificationTitleSystemNotification),
            allTranslations(localization.accountUserCopyCode),
            {},
            1000
        );
    }

    const contact = account.contacts.find((t) => t.type === 'personal');
    const showImageUser = (account.picture) ? true : false;
    const color = contact?.color || '#0f7bed';

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={handleToProfile} style={styles.root}>
                <View style={[styles.imageContainer, { borderColor: color || '#0f7bed' }, !showImageUser && { padding: 0 }]}>
                    {
                        showImageUser ? (
                            <Image style={styles.image} source={{
                                uri: account.picture
                            }}/>
                        ) : (
                            <PersonalSmallCard color={color}/>
                        )
                    }
                </View>

                <View style={styles.informationContainer}>
                    <Text style={styles.typographyName}>{account.firstName} {account.lastName}</Text>
                </View>

                <View style={styles.arrowContainer}>
                    <Icon name={'arrow-right'} type={'Feather'} style={styles.arrow}/>
                </View>
            </TouchableOpacity>

            <View style={styles.containerCode}>
                <Text style={styles.containerCodeTitle}>{ allTranslations(localization.accountUserYourCode) }</Text>

                <View style={styles.containerCodeRight}>
                    <Text style={styles.containerCodeCode}>{ contact?.requestRef?.code }</Text>

                    <TouchableOpacity style={styles.containerCodeButton} onPress={() => handleCopyCode(contact?.requestRef?.code)}>
                        <Icon type="Feather" name="copy" style={{ fontSize: 18, color: '#ef9c20' }}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 24
    },

    root: {
        padding: 16,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row'
    },

    image: {
        flex: 1,
        borderRadius: 999
    },
    imageContainer: {
        width: 75,
        height: 75,
        overflow: 'hidden',
        padding: 2,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#0f7bed',
        borderRadius: 999,
        marginRight: 16
    },

    arrow: {
        color: '#8152E4'
    },
    arrowContainer: {},

    informationContainer: {
        flex: 1
    },

    containerCode: {
        borderTopWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ededed',

        paddingHorizontal: 16,
        paddingVertical: 8,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    containerCodeTitle: {
        fontFamily: 'AtypText',
        opacity: 0.6
    },
    containerCodeRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerCodeCode: {
        fontFamily: 'AtypText_medium',
        letterSpacing: 1
    },
    containerCodeButton: {
        width: 40,
        height: 30,

        justifyContent: 'center',
        alignItems: 'center'
    },

    typographyName: {
        fontFamily: 'AtypText_semibold',
        color: 'black',
        fontSize: 20,
        lineHeight: 22
    },
    typographyPosition: {
        fontFamily: 'AtypText',
        opacity: 0.6
    },


})

export default User
