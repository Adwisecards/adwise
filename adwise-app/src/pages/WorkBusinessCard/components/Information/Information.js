import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import {Icon} from "native-base";
import {formatPhoneNumber} from "../../../../helper/format";

const Information = (cutawayData) => {
    let list = [];

    if (!!cutawayData.phone.value) {
        list.push({
            type: 'Feather',
            icon: 'phone',
            value: formatPhoneNumber(cutawayData.phone.value)
        })
    }
    if (!!cutawayData.email.value) {
        list.push({
            type: 'Feather',
            icon: 'mail',
            value: cutawayData.email.value
        })
    }
    if (!!cutawayData.website.value) {
        list.push({
            type: 'MaterialIcons',
            icon: 'language',
            value: cutawayData.website.value
        })
    }

    if (list.length <= 0){
        return null
    }

    return (
        <View style={[styles.containerContactInformation, styles.borderContainer]}>

            {
                list.map((item, idx) => (
                    <View key={'information-' + idx}>
                        <View style={styles.itemContactInformation}>
                            <View style={styles.itemContactInformation_IconContainer}>
                                <Icon name={item.icon} type={item.type} style={styles.itemContactInformation_Icon}/>
                            </View>

                            <Text
                                style={styles.itemContactInformation_Title}>{item.value}</Text>
                        </View>
                        {
                            (idx < list.length - 1) && <View style={styles.separateContactInformation}/>
                        }
                    </View>
                ))
            }
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
        marginBottom: 12
    },

    itemContactInformation: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2,
    },
    itemContactInformation_IconContainer: {
        width: 20,
        height: 20,
        marginRight: 18
    },
    itemContactInformation_Icon: {
        color: '#ED8E00',
        fontSize: 20
    },
    itemContactInformation_Title: {
        fontSize: 16,
        lineHeight: 23,
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
});

export default Information
