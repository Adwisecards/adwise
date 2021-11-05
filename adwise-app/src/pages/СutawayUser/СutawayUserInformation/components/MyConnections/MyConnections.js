import React from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    MyConnectionCard
} from '../../../../../components'
import {Icon} from "native-base";

const { width } = Dimensions.get('window');
const widthCard = ((width - 12) / 2);

const MyConnections = (props) => {
    const { contacts } = props;

    const handleGetList = () => {
        return [...contacts].splice(contacts.length - 2, contacts.length)
    }

    const handleToUserPage = (contact) => {
        // props.navigation.push('CutawayUserInformation', {
        //     id: contact._id
        // });
    }

    const handleToAllPage = () => {
        props.navigation.push('BusinessCardAllContact', {
            contacts
        });
    }

    return (
        <View style={[styles.sectionCards]}>
            <TouchableOpacity style={styles.sectionCards_Header} onPress={handleToAllPage}>

                <Text style={styles.sectionCards_Title}>
                    Связи <Text style={styles.sectionCards_Count}>{ contacts.length }</Text>
                </Text>

                <View style={styles.sectionButtonArrow}>
                    <Icon style={styles.sectionArrow} name={'arrow-forward'} type={'MaterialIcons'}/>
                </View>

            </TouchableOpacity>

            <View style={styles.sectionCards_List}>
                {
                    handleGetList().map((contact, idx) => (
                        <View style={{ width: widthCard, marginBottom: 12 }} key={'connection-card-' + idx}>
                            <MyConnectionCard
                                contactId={contact}
                                onPress={(contact) => handleToUserPage(contact)}
                                disabled
                                {...props}
                            />
                        </View>
                    ))
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionCards: {
        marginBottom: 24
    },
    sectionCards_Header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        marginBottom: 12
    },
    sectionCards_Title: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 26
    },
    sectionCards_Count: {
        color: '#8152e4',
        marginLeft: 6
    },
    sectionCards_List: {
        marginLeft: -12,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    sectionCards_Button: {
        marginTop: 12,

        width: '100%',
        height: 33,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#9671e6',
        borderRadius: 8
    },
    sectionCards_ButtonText: {
        color: '#8152E4',
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 30,
        textTransform: 'uppercase',
        textAlign: 'center',
    },

    sectionButtonArrow: {
        width: 50,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',

        marginRight: -12
    },
    sectionArrow: {
        fontSize: 20,
        color: '#8152e4'
    },
})

export default MyConnections
