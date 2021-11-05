import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,

    StyleSheet,

    ImageBackground,

    Image,
} from 'react-native';
import {
    Icon
} from "native-base";

import contactsUserImage from '../../../../../assets/graphics/contacts/contacts_user_image.png';
import urls from "../../../../constants/urls";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

class Contact extends React.PureComponent {
    constructor(props) {
        super(props);

    }

    render() {
        const { idx, activeContact, onInviteUser, onOpenInfo, onOpenUserCard, search } = this.props;

        const contactKey = `${ this.props.id }-${idx}-${ this.props.phone }`;
        const isActive = contactKey === activeContact;
        const isUserSystem = Boolean(this.props.user_system);
        const userSystem = this.props.user_system;

        const handleInviteUser = () => {
            onInviteUser(this.props);
        }
        const handleOpenInformation = () => {
            if (isActive) {
                onOpenInfo(null);

                return null
            }

            onOpenInfo(contactKey);
        }

        return (
            <View
                style={[
                    styles.container,
                    isActive && styles.containerActive
                ]}
            >
                <TouchableHighlight onPress={handleOpenInformation} underlayColor="rgba(0, 0, 0, 0)">
                    <View style={styles.card}>
                        <View style={[styles.cardLogoContainer, !isUserSystem && { borderColor: 'rgba(0, 0, 0, 0)' }]}>
                            {
                                (isUserSystem && userSystem?.picture?.value) ? (
                                    <Image source={{ uri: userSystem?.picture?.value }} style={styles.cardLogo}/>
                                ) : (
                                    <ImageBackground source={contactsUserImage} style={styles.cardLogo}>
                                        <Text style={styles.cardLogoText}>{ this.props.full_name[0] }</Text>
                                    </ImageBackground>
                                )
                            }
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardUserName}>{ this.props.full_name }</Text>
                            {
                                (isUserSystem && !!userSystem?.activity?.value) && (
                                    <Text style={styles.cardUserRole}>{ userSystem?.activity?.value }</Text>
                                )
                            }
                        </View>
                    </View>
                </TouchableHighlight>

                {
                    isActive && (
                        <View style={styles.cardControls}>
                            {
                                isUserSystem && false && (
                                    <TouchableOpacity style={styles.cardControl}>
                                        <View style={styles.cardControlIconContainer}>
                                            <Icon style={styles.cardControlIcon} type="MaterialIcons" name="date-range"/>
                                        </View>
                                        <Text style={styles.cardControlName}>{allTranslations(localization.commonScheduler)}</Text>
                                    </TouchableOpacity>
                                )
                            }

                            {
                                !isUserSystem ? (
                                    <TouchableOpacity style={styles.cardControl} onPress={handleInviteUser}>
                                        <View style={styles.cardControlIconContainer}>
                                            <Icon style={styles.cardControlIcon} type="MaterialIcons" name="person-add"/>
                                        </View>
                                        <Text style={styles.cardControlName}>{allTranslations(localization.contactsToInvite)}</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.cardControl} onPress={() => onOpenUserCard(this.props)}>
                                        <View style={styles.cardControlIconContainer}>
                                            <Icon style={styles.cardControlIcon} type="MaterialIcons" name="person"/>
                                        </View>
                                        <Text style={styles.cardControlName}>{allTranslations(localization.contactsOpenBusinessCard)}</Text>
                                    </TouchableOpacity>
                                )
                            }

                        </View>
                    )
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,

        paddingVertical: 12,
        paddingHorizontal: 16
    },
    containerActive: {
        backgroundColor: 'white',
        borderRadius: 10
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardLogoContainer: {
        width: 65,
        height: 65,

        borderRadius: 999,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#8152E4',

        marginRight: 12,

        padding: 3
    },
    cardLogo: {
        justifyContent: 'center',
        alignItems: 'center',

        width: '100%',
        height: '100%',

        borderRadius: 999,

        overflow: 'hidden'
    },
    cardLogoText: {
        fontFamily: 'AtypText_medium',
        fontSize: 32,
        lineHeight: 32,
        color: 'white'
    },
    cardUserName: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: 'black'
    },
    cardUserRole: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 18,
        color: 'black',
        opacity: 0.6,

        marginTop: 4
    },

    cardControls: {
        flexDirection: 'row',
        marginLeft: -12,
        marginTop: 12
    },

    cardControl: {
        flex: 1,

        marginLeft: 12,

        padding: 10,

        backgroundColor: '#F8F8F8',
        borderRadius: 4,

        alignItems: 'center'
    },
    cardControlIconContainer: {
        width: 20,
        height: 20,

        justifyContent: 'center',
        alignItems: 'center'
    },
    cardControlIcon: {
        fontSize: 20,
        color: '#8152E4'
    },
    cardControlName: {
        fontFamily: 'AtypText_medium',
        fontSize: 11,
        lineHeight: 16,
        opacity: 0.6
    }
});

export default Contact
