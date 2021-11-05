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
import Coupon from '../Coupon';

const Section = (props) => {
    const { title, items, isLastSection } = props;

    return (
        <View style={[styles.section, isLastSection && { marginBottom: 0 }]}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{ title }</Text>

                <TouchableOpacity style={styles.sectionButtonArrow}>
                    <Icon style={styles.sectionArrow} name={'arrow-forward'} type={'MaterialIcons'}/>
                </TouchableOpacity>
            </View>

            <View style={styles.sectionBody}>
                {
                    items.map((coupon, idx) => (
                        <Coupon key={'coupon-' + idx} {...coupon} isLast={idx === items.length - 1} {...props}/>
                    ))
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    sectionTitle: {
        flex: 1,
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 25,
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
        opacity: 0.5
    },
});

export default Section
