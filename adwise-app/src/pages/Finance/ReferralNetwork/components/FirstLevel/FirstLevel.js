import React from "react";
import {
    Text,
    View,
    StyleSheet
} from 'react-native';
import {
    CardUser
} from '../../../components';
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const FirstLevel = (props) => {
    const {subscriptions, organization} = props;

    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{allTranslations(localization.financeTitleLevel1)} <Text style={{color: '#8152e4'}}>{ (subscriptions[0]) ? subscriptions[0]['items'].length : 0 } {allTranslations(localization.financeTitleLevel2)}</Text></Text>
            </View>

            {
                (subscriptions[0] && subscriptions[0]['items'].length > 0) ? (
                    <View style={styles.grid}>

                        {
                            subscriptions[0]['items'].map((item, idx) => (
                                <View key={`subscription-${idx}`} style={styles.item}>
                                    <CardUser subscriberId={item.subscriber} organization={organization}/>
                                </View>
                            ))
                        }

                    </View>
                ) : (
                    <Text>{allTranslations(localization.commonNotData)}</Text>
                )
            }

        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 12
    },
    headerTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 28
    },

    buttonArrow: {
        width: 40,
        height: 40,

        margin: -10,

        justifyContent: 'center',
        alignItems: 'center'
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',

        marginLeft: -8
    },
    item: {
        width: "50%",

        paddingLeft: 12,

        marginBottom: 12
    },


});

export default FirstLevel
