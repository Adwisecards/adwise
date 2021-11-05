import React from "react";
import {
    View,

    Text,

    StyleSheet,

    TouchableOpacity,

    Image
} from 'react-native';
import {
    CompanyPageLogo
} from '../../../../../icons';
import {Icon} from "native-base";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const СutawayCard = (props) => {
    const color = props.colors.primary;
    const isLogoOrganization = !!props.picture;

    const cashbackFirstLevel = props.distributionSchema.first;
    const cashbackOtherLevel = props.distributionSchema.other;

    return (
        <View style={styles.card}>
            <View style={[styles.cardLeft, { backgroundColor: color }]}>
                <View style={styles.cardLogoContainer}>
                    {
                        (isLogoOrganization) ? (
                            <Image source={{ uri: props.picture }} style={styles.cardLogo} resizeMode="cover"/>
                        ) : (
                            <CompanyPageLogo color={color}/>
                        )
                    }
                </View>

                <Text style={styles.cardOrganizationName}>{ props.name }</Text>
            </View>
            <View style={styles.cardRight}>

                <Text style={styles.cardTitle}>{allTranslations(localization.financeGeneralInformation)}</Text>

                <View style={styles.cardBody}>
                    <View>
                        <Text style={styles.cardBodyTitle}>{allTranslations(localization.financePersonalLevel)}</Text>
                        <Text style={[styles.cardBodyValue, { color }]}>{allTranslations(localization.financeTitleLevel1)}</Text>
                    </View>
                    <View style={styles.cardBodySeparate}/>
                    <View>
                        <Text style={styles.cardBodyTitle}>{allTranslations(localization.financePersonalCashback)}</Text>
                        <Text style={[styles.cardBodyValue, { color }]}>{ props.cashback }%</Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <Text style={styles.cardFooterTitle}>{allTranslations(localization.financeTitleLevel1)} <Text style={{ color }}>{ cashbackFirstLevel }%</Text></Text>
                    <Text style={styles.cardFooterTitle}>{allTranslations(localization.financeTitleLevel2_21)} <Text style={{ color }}>{ cashbackOtherLevel }%</Text></Text>
                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '100%',

        backgroundColor: 'white',

        borderRadius: 10,

        flexDirection: 'row',
        flexShrink: 1,

        overflow: 'hidden',

        elevation: 4,
    },
    cardLeft: {
        maxWidth: 110,
        width: '100%',

        padding: 14,

        alignItems: 'center',
        justifyContent: 'center'
    },
    cardRight: {
        flex: 1,

        padding: 14
    },

    cardLogoContainer: {
        width: 70,
        height: 70,

        padding: 8,

        borderRadius: 999,

        overflow: 'hidden',

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: 'white',

        marginBottom: 16
    },
    cardLogo: {
        width: 60,
        height: 60,

        borderRadius: 999
    },

    cardOrganizationName: {
        fontFamily: 'AtypText_semibold',
        fontSize: 10,
        lineHeight: 12,
        textAlign: 'center',
        color: 'white'
    },

    cardTitle: {
        fontFamily: 'AtypText_semibold',
        fontSize: 16,
        lineHeight: 18,

        marginBottom: 14
    },

    cardBody: {
        flexDirection: 'row',
    },

    cardBodySeparate: {
        height: '100%',
        width: 1,
        backgroundColor: 'black',
        opacity: 0.1,
        marginHorizontal: 12
    },

    cardBodyTitle: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 17,
        color: '#808080'
    },
    cardBodyValue: {
        fontFamily: 'AtypText_semibold',
        fontSize: 14,
        lineHeight: 17
    },

    cardFooter: {
        width: '100%',

        marginTop: 14,

        paddingTop: 8,

        borderTopWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.1)'
    },

    cardFooterTitle: {
        fontFamily: 'AtypText',
        fontSize: 12,
        lineHeight: 17,
        color: '#808080'
    }
});

export default СutawayCard
