import React from "react";
import {
    View,

    Text,

    StyleSheet,

    TouchableOpacity
} from 'react-native';
import {Icon} from "native-base";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const GridRow = (props) => {
    const cashbackOtherLevel = props.organization.distributionSchema.other;

    return (
        <View style={[
            styles.row,

            (props.isLast) && styles.rowLast
        ]}>
            <Text style={styles.rowTitle}>{ props.level } {allTranslations(localization.commonLevel)}</Text>
            <Text style={styles.rowValue}>{ (props.items) ? props.items.length : 0 } {allTranslations(localization.financeTitleLevel2)} / { cashbackOtherLevel }%</Text>
        </View>
    )
};

const OtherLevel = (props) => {
    let subscriptions = [...props.subscriptions];
    subscriptions.splice(0, 1);



    const list = [...subscriptions];

    let countSubscriptions = 0;

    list.map((item) => {
        if (item.items) {
            countSubscriptions += Number(item.items.length);
        }
    })

    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{allTranslations(localization.financeTitleLevel2_21)} { countSubscriptions } {allTranslations(localization.financeTitleLevel2)}</Text>
            </View>

            <View style={styles.grid}>
                {
                    list.map((item, key) => (
                        <GridRow key={`element-${ key }`} {...item} isLast={(key === list.length - 1) ? true : false} organization={props.organization}/>
                    ))
                }
            </View>

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
        backgroundColor: 'white',

        borderRadius: 10,

        paddingHorizontal: 12,
        paddingVertical: 2,

        overflow: 'hidden'
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        paddingVertical: 10,

        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E8E8E8'
    },
    rowLast: {
        borderBottomWidth: 0
    },
    rowTitle: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 23,
        color: '#808080'
    },
    rowValue: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 23,
        color: '#000000'
    },
});

export default OtherLevel
