import React, {useRef} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {SwipeRow} from "react-native-swipe-list-view";
import RoundContainerStubs from "../../../../components/plugs/RoundContainerStubs/RoundContainerStubs";
import {
    Anchor,
    CompanyPageLogo
} from '../../../../icons';
import localization from "../../../../localization/localization";
import allTranslations from "../../../../localization/allTranslations";
import {Icon} from "native-base";

const OrganizationCardLoading = (props) => {
    return (
        <View style={styles.root}>
            <View style={styles.rootLeft}>
                <View style={[styles.rootLogo, {backgroundColor: '#DCDCDC'}]}>
                    <View style={{width: 58, height: 58, borderRadius: 999, backgroundColor: ''}}/>
                </View>
                <View style={styles.rootContent}>
                    <View style={[styles.titleLoading]}/>
                    <View style={[styles.descriptionLoading, styles.descriptionLoading]}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        minHeight: 80,

        width: '100%',
        flexDirection: 'row',
        flexShrink: 1,
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden'
    },
    rootLeft: {
        flexDirection: 'row',
        flex: 1,
        paddingRight: 4
    },

    rootLogo: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 82,
        minHeight: 50,
        marginRight: 12,
        marginLeft: -12,
        marginVertical: -12
    },
    rootContent: {
        flexShrink: 1,
        width: '100%',
        flex: 1
    },
    titleLoading: {
        height: 13,
        width: '50%',
        marginBottom: 4,

        borderRadius: 4,
        backgroundColor: '#DCDCDC'
    },
    descriptionLoading: {
        height: 10,
        width: '45%',
        opacity: 0.5,

        marginBottom: 4,
        borderRadius: 4,
        backgroundColor: '#DCDCDC'
    }
});

export default OrganizationCardLoading
