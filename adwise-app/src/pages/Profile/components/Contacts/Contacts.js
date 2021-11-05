import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {Icon} from "native-base";
import moment from "moment";
import {formatPhoneNumber, awaitFormatPhone} from "../../../../helper/format";
import {PersonalBusinessPage} from "../../../../icons";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const Contacts = (props) => {
    const {account, styleRoot, onOpenEdit} = props;
    const [ formatPhoneNumber, setFormatPhoneNumber ] = useState('');

    useEffect(() => {
        ( async () => {
            setFormatPhoneNumber(await awaitFormatPhone(props.phone))
        })()
    }, []);

    const handleToEditProfile = (type) => {
        if (!type) {
            props.navigation.navigate('ProfileEdit');

            return null
        }

        onOpenEdit(type)
    }
    const handleGetGender = (gender) => {
        switch (gender) {
            case "male": return allTranslations(localization.genderMale)
            case "female": return allTranslations(localization.genderFemale)
            default: return allTranslations(localization.genderOther)
        }
    }

    const contact = account.contacts.find((t) => t.type === 'personal');
    const color = contact?.color || '#0f7bed';

    return (
        <View style={[styles.containerContactInformation, styles.borderContainer]}>

            <View style={styles.itemContactInformation}>
                <View style={styles.containerImageCard}>
                    {
                        (props.account.picture) ? (
                            <View style={[styles.imageCard, { backgroundColor: color }]}>
                                <PersonalBusinessPage color="rgba(0, 0, 0, 0)" hideAvatar style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: -20,
                                    width: 600,
                                    height: 200,
                                    zIndex: -1
                                }}/>
                                <Image style={styles.imageCardRound} source={{uri: props.account.picture}}/>
                                <PersonalBusinessPage color="rgba(0, 0, 0, 0)" hideAvatar style={{
                                    position: 'absolute',
                                    top: -20,
                                    right: 0,
                                    width: 600,
                                    height: 200,
                                    zIndex: -1
                                }}/>
                            </View>
                        ) : (
                            <View style={styles.imageCard}>
                                <PersonalBusinessPage color={color}/>
                            </View>
                        )
                    }
                </View>
            </View>

            <View style={styles.separateContactInformation}/>

            <View style={styles.itemContactInformation}>
                <Text style={styles.itemContactInformation_Name}>{ allTranslations(localization.profileName) }</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={styles.itemContactInformation_Title}>{props.firstName}</Text>
                </View>
            </View>

            <View style={styles.separateContactInformation}/>

            <View style={styles.itemContactInformation}>
                <Text style={styles.itemContactInformation_Name}>{ allTranslations(localization.profileSurname) }</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={styles.itemContactInformation_Title}>{props.lastName}</Text>
                </View>
            </View>

            <View style={styles.separateContactInformation}/>

            <View style={styles.itemContactInformation}>
                <Text style={styles.itemContactInformation_Name}>{ allTranslations(localization.profileGender) }</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={styles.itemContactInformation_Title}>{handleGetGender(props.gender)}</Text>
                </View>
            </View>

            <View style={styles.separateContactInformation}/>

            <View style={styles.itemContactInformation}>
                <Text style={styles.itemContactInformation_Name}>{ allTranslations(localization.profileDateBirth) }</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={styles.itemContactInformation_Title}>{moment(props.dob).format('DD.MM.YYYY')}</Text>
                </View>
            </View>

            <View>
                <View style={styles.separateContactInformation}/>

                <View style={styles.itemContactInformation}>
                    <Text style={styles.itemContactInformation_Name}>Email</Text>
                    {
                        props.email ? (
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text style={styles.itemContactInformation_Title}>{props.email}</Text>

                                <TouchableOpacity style={styles.formButtonChange}
                                                  onPress={() => handleToEditProfile('email')}>
                                    <Icon style={styles.formButtonChangeIcon} name={'edit-2'} type={'Feather'}/>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.buttonEdit} onPress={() => handleToEditProfile('email')}>
                                <Text style={styles.buttonEditText}>{ allTranslations(localization.profileProvideEmail) }</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>

            <View>
                <View style={styles.separateContactInformation}/>

                <View style={styles.itemContactInformation}>
                    <Text style={styles.itemContactInformation_Name}>{ allTranslations(localization.profilePhone) }</Text>
                    {
                        props.phone ? (
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text style={styles.itemContactInformation_Title}>{formatPhoneNumber}</Text>

                                <TouchableOpacity style={styles.formButtonChange} onPress={() => handleToEditProfile('phone')}>
                                    <Icon style={styles.formButtonChangeIcon} name={'edit-2'} type={'Feather'}/>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.buttonEdit} onPress={() => handleToEditProfile('phone')}>
                                <Text style={styles.buttonEditText}>{ allTranslations(localization.profileProvidePhoneNumber) }</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {},

    borderContainer: {
        backgroundColor: 'white',
        borderRadius: 10
    },

    containerContactInformation: {
        padding: 12,
        marginBottom: 48
    },

    itemContactInformation: {
        padding: 2,
    },
    itemContactInformation_Name: {
        fontFamily: 'AtypText',
        fontSize: 15,
        lineHeight: 17,
        opacity: 0.6,
        marginBottom: 4
    },
    itemContactInformation_Title: {
        fontSize: 18,
        lineHeight: 25,
        fontFamily: 'AtypText'
    },
    separateContactInformation: {
        width: '100%',
        height: 1,
        borderTopWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E8E8E8',
        marginVertical: 14
    },

    buttonEdit: {
        width: '100%'
    },
    buttonEditText: {
        fontSize: 18,
        lineHeight: 25,
        fontFamily: 'AtypText',
        color: '#8152E4'
    },

    formButtonChange: {
        width: 25,
        height: 25,

        justifyContent: 'center',
        alignItems: 'center'
    },
    formButtonChangeIcon: {
        fontSize: 18,
        color: '#8152E4'
    },

    containerImageCard: {
        width: '100%'
    },
    imageCard: {
        justifyContent: 'center',
        alignItems: 'center',

        flex: 1,
        height: 150,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 12
    },
    imageCardRound: {
        width: 137,
        height: 137,
        borderRadius: 999
    },
});

export default Contacts
