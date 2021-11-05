import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import {
    Icon
} from 'native-base';
import axios from "../../../../plugins/axios";
import urls from "../../../../constants/urls";

const MyConnectionCard = (props) => {
    const { onPress, contactId, noMargin, remove, activeParticipants } = props;
    const [isLoading, setLoading] = useState(true);
    const [contact, setContact] = useState({});

    useEffect(() => {
        handleLoadContact()
    }, [])

    const handleLoadContact = () => {
        axios('get', urls["get-contact"] + contactId).then(res => {
            setContact(res.data.data.contact)
            setLoading(false)
        });
    }

    if (activeParticipants && activeParticipants.indexOf(contactId) > -1){
        return null
    }

    if (isLoading){
        return (
            <View style={[styles.root, styles.rootLoading]}>
                <ActivityIndicator size="large" color="#ED8E00"/>
            </View>
        )
    }

    const imageUri = (contact.picture.value) ? contact.picture.value : null;

    return (
        <TouchableOpacity onPress={() => onPress(contact)} style={{ width: '100%' }}>
            <View style={[styles.root, isLoading && styles.rootLoading, noMargin && { marginLeft: 0 }]}>
                <View style={[styles.rootLeft, !imageUri && styles.rootLeftPug]}>
                    {
                        imageUri ? (
                            <Image style={styles.image} source={{ uri: imageUri }}/>
                        ) : (
                            <Icon name={'person'} type={'MaterialIcons'} style={{ color: '#ED8E00' }}/>
                        )
                    }
                </View>
                <View style={styles.rootRight}>
                    <View style={{ marginBottom: 4 }}>
                        <Text style={styles.fontName}>{ contact.firstName.value }</Text>
                        <Text style={styles.fontName}>{ contact.lastName.value }</Text>
                    </View>

                    <Text style={styles.formDescription}>{ contact.description.value }</Text>
                </View>

                {
                    isLoading && (
                        <View style={styles.loading} />
                    )
                }

                {
                    remove && (
                        <View style={styles.iconRemoveContainer}>
                            <Icon style={styles.iconRemove} type={"MaterialIcons"} name={'close'}/>
                        </View>
                    )
                }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        marginLeft: 12,
        flexDirection: 'row',
        position: 'relative'
    },
    rootLoading: {
        height: 65,
        justifyContent: 'center',
        alignItems: 'center'
    },

    rootLeft: {
        width: 60
    },
    rootLeftPug: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    rootRight: {
        paddingHorizontal: 8,
        paddingVertical: 12,

        flexShrink: 1
    },

    image: {
        flex: 1
    },

    fontName: {
        fontFamily: 'AtypText_semibold',
        fontSize: 13,
        lineHeight: 14
    },
    formDescription: {
        fontSize: 10,
        lineHeight: 12,
        opacity: 0.5
    },

    iconRemoveContainer: {
        position: 'absolute',
        right: -6,
        top: -6,

        justifyContent: 'center',
        alignItems: 'center',

        width: 24,
        height: 24,
        backgroundColor: '#8152E4',
        borderRadius: 999
    },
    iconRemove: {
        fontSize: 18,
        color: 'white'
    },
});

export default MyConnectionCard
