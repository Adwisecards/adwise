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
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import { UserSmall } from '../../icons';

class UserSmallCard extends React.PureComponent {

    render() {
        const { user, onPress, disabled } = this.props;
        const { contact } = user;

        const imageUri = (contact.picture.value) ? contact.picture.value : null;



        return (
            <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={(!disabled) ? 0.2 : 1}
                onPress={() => onPress(contact)}
            >
                <View style={styles.root}>
                    <View style={[styles.rootLeft, !imageUri && styles.rootLeftPug]}>
                        {
                            imageUri ? (
                                <Image
                                    style={styles.image}
                                    source={{ uri: imageUri }}
                                    accessible={false}
                                    progressiveRenderingEnabled={true}
                                    resizeMethod={'resize'}
                                />
                            ) : (
                                <UserSmall color={'#ED8E00'}/>
                            )
                        }
                    </View>
                    <View style={styles.rootRight}>
                        <View style={{ marginBottom: 4 }}>
                            <Text style={styles.fontName}>{ contact.firstName.value }</Text>
                            <Text style={styles.fontName}>{ contact.lastName.value }</Text>
                        </View>

                        <Text
                            style={styles.formDescription}
                            numberOfLines={2}
                        >{ contact.activity.value }</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,

        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'relative'
    },
    rootLoading: {
        height: 65,
        justifyContent: 'center',
        alignItems: 'center'
    },

    rootLeft: {
        width: 60,

        height: '100%',
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

    notMargin: {
        marginLeft: 0,
        marginBottom: 0,
        marginRight: 0,
        marginTop: 0
    }
});

export default UserSmallCard
