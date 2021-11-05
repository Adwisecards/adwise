import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Icon
} from 'native-base';
import i18n from 'i18n-js';
import {
    OrganizationCard
} from '../../../../components';
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const Recommendation = (props) => {
    const {hideTitle, navigation, list} = props;

    const handleToMyRecommendation = () => {
        navigation.navigate('MyRecommendation')
    }

    if (list.length < 1) {
        return (
            <View style={styles.root}>
                <View style={styles.rootTop}>
                    <Text style={styles.rootTitle}>{ allTranslations(localization.dashboardRecommendationTitle) } <Text style={{ color: '#8152E4' }}>{list.length}</Text></Text>
                </View>

                <Text style={styles.notData}>{ allTranslations(localization.dashboardRecommendationEmpty) }</Text>
            </View>
        )
    }

    const listItems = [...list].splice(0, 2);

    return (
        <View style={styles.root}>
            {
                (!hideTitle) && (
                    <TouchableOpacity onPress={handleToMyRecommendation} style={styles.rootTop}>
                        <Text style={styles.rootTitle}>{ allTranslations(localization.dashboardRecommendationTitle) } <Text style={{ color: '#8152E4' }}>{list.length}</Text></Text>

                        <View style={styles.buttonGo} onPress={handleToMyRecommendation}>
                            <Icon type={'Feather'} name={'arrow-right'} style={{color: '#8152E4'}}/>
                        </View>
                    </TouchableOpacity>
                )
            }

            <View style={styles.listRecommendation}>
                {
                    listItems.map((organizationId, idx) => (
                        <OrganizationCard
                            key={'organization-' + organizationId + '-' + idx}
                            organizationId={organizationId}
                            navigation={navigation}
                        />
                    ))
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {},
    rootTop: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    rootTitle: {
        fontSize: 18,
        lineHeight: 25,
        fontFamily: 'AtypText',
        color: '#000000'
    },

    buttonGo: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        marginRight: -4
    },
    buttonGoIcon: {
        flex: 1
    },

    listRecommendation: {
        marginBottom: -12,
    },

    notData: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 26,
        color: '#808080'
    },
});

export default Recommendation
