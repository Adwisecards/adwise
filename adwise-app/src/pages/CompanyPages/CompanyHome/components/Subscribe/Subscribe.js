import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {amplitudeLogEventWithPropertiesAsync} from "../../../../../helper/Amplitude";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const Subscribe = (props) => {
    const {
        color, companySubscription, subscribeCompany,
        unsubscribeCompany, organizationId
    } = props;

    const handleToShare = () => {
        props.navigation.navigate('ShareCompany', {
            organizationId: organizationId,
            color
        })
    }

    if (companySubscription){
        return (
            <View style={[styles.sectionSubscribe]}>
                <TouchableOpacity style={[styles.subscribeButton, { backgroundColor: color }]} onPress={handleToShare}>
                    <Text style={styles.subscribeButtonText}>{allTranslations(localization.commonShare)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.unsubscribeButton, { borderColor: color }]} onPress={unsubscribeCompany}>
                    <Text style={[styles.unsubscribeButtonText, { color: color }]}>{allTranslations(localization.commonHide)}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={[styles.sectionSubscribe]}>
            <TouchableOpacity style={[styles.subscribeButton, { backgroundColor: color }]} onPress={subscribeCompany}>
                <Text style={styles.subscribeButtonText}>{allTranslations(localization.commonSubscribe)}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionSubscribe: {
        marginBottom: 24
    },
    subscribeButton: {
        width: '100%',
        borderRadius: 10,
        paddingVertical: 10
    },
    subscribeButtonText: {
        fontSize: 20,
        lineHeight: 22,
        color: 'white',
        fontFamily: 'AtypText_medium',
        textAlign: 'center'
    },
    subscribeDescription: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 17,
        fontFamily: 'AtypText'
    },

    unsubscribeButton: {
        width: '100%',
        borderRadius: 10,
        paddingVertical: 10,

        marginTop: 12,

        backgroundColor: 'rgba(255, 255, 255, 0.8)',

        borderWidth: 1,
        borderStyle: 'solid',
    },
    unsubscribeButtonText: {
        fontSize: 20,
        lineHeight: 22,
        fontFamily: 'AtypText_medium',
        textAlign: 'center'
    },
})

export default Subscribe
