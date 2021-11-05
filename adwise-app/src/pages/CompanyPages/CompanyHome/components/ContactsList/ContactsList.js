import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import {
    UserSmallCard,
    UserSmallCardLoadings
} from '../../../../../components';
import {hexToRGBA} from "../../../../../helper/converting";
import {Icon} from "native-base";

const { width } = Dimensions.get('window');
const widthCard = ((width - 24) / 2) - 6;

const ContactsList = (props) => {
    const { contacts, color, companyName, title, countContacts, isLoading, url } = props;

    const listContacts = [...contacts].slice(0, 2);

    const handleToAllUser = () => {
        props.navigation.navigate('UsersCompanyPages', {
            url,
            contacts,
            countContacts,
            color,
            title,
            companyName: companyName
        })
    }

    const handleToUser = () => {}

    const isShowGo = countContacts > 2;

    return (
        <View style={styles.root}>

            <TouchableOpacity style={styles.header} activeOpacity={isShowGo ? 0.2 : 1} onPress={isShowGo ? handleToAllUser : null}>
                <Text style={styles.headerTitle}>{ props.title } <Text style={{ color: props.color }}>{ countContacts }</Text></Text>

                {
                    isShowGo && (
                        <Icon style={[styles.sectionArrow, { color: props.color }]} name={'arrow-forward'} type={'MaterialIcons'}/>
                    )
                }
            </TouchableOpacity>

            <View style={styles.list}>
                {
                    ( isLoading ) && (
                        <>
                            <View style={{ width: widthCard, marginBottom: 12, marginLeft: 12 }}><UserSmallCardLoadings/></View>
                            <View style={{ width: widthCard, marginBottom: 12, marginLeft: 12 }}><UserSmallCardLoadings/></View>
                        </>
                    )
                }

                {
                    listContacts.map((contact, idx) => (
                        <View key={`contact-${ contact._id }-${idx}`} style={{ width: widthCard, marginBottom: 12, marginLeft: 12 }}>
                            <UserSmallCard user={contact} disabled onPress={handleToUser}/>
                        </View>
                    ))
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        marginBottom: 24
    },

    title: {
        fontSize: 18,
        lineHeight: 25,
        fontFamily: 'AtypText',

        marginBottom: 12
    },

    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: -12
    },

    buttonShowAll: {
        width: '100%',
        paddingTop: 11,
        paddingBottom: 7,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1
    },
    buttonShowAllText: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 15,
        letterSpacing: 0.195,
        textTransform: 'uppercase'
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 8
    },
    headerTitle: {
        fontSize: 18,
        lineHeight: 18,
        fontFamily: 'AtypText'
    },
    headerArrow: {},
    sectionButtonArrow: {},
    sectionArrow: {
        fontSize: 20
    },
})

export default ContactsList
