import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const WithoutAccess = (props) => {

    return (
        <View>
            <Text>{allTranslations(localization.contactsNotPermission)}</Text>
        </View>
    )
}

export default WithoutAccess
