import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    OrganizationCard
} from '../../../../components';
import {Icon} from "native-base";

const Recommendation = ( props ) => {
    const { subscriptions } = props;

    const handleGetLiseRecommendation = () => {
        return [...subscriptions].slice(0, 2)
    }

    const handleOpenAll = () => {
        props.navigation.push('BusinessCardAllRecommendation', {
            subscriptions
        })
    }

    return (
        <View style={[styles.sectionCards]}>
            <TouchableOpacity style={styles.sectionCards_Header} onPress={handleOpenAll}>
                <Text style={styles.sectionCards_Title}>
                    Рекомендации <Text style={styles.sectionCards_Count}>{ subscriptions.length }</Text>
                </Text>

                <View style={styles.sectionButtonArrow}>
                    <Icon style={styles.sectionArrow} name={'arrow-forward'} type={'MaterialIcons'}/>
                </View>
            </TouchableOpacity>

            <View style={styles.sectionCards_List}>
                {
                    handleGetLiseRecommendation().map((organizationId, idx) => (
                        <OrganizationCard
                            key={'organization-' + organizationId + '-' + idx}
                            organizationId={organizationId}
                            navigation={props.navigation}
                        />
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
        alignItems: 'center',
        justifyContent: 'space-between',

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
    sectionCards_List: {},
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
});

export default Recommendation
