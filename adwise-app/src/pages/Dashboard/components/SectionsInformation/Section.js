import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import MyConnections from '../MyConnections';
import Recommendation from '../Recommendation';

const Section = (props) => {

    return (
        <View style={styles.root}>
            <View style={styles.sectionRecommendation}>
                <Recommendation
                    list={props.subscriptions}
                    navigation={props.navigation}
                />
            </View>

            <View style={styles.sectionMyConnections}>
                <MyConnections list={props.contacts} navigation={props.navigation}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {},
    sectionRecommendation: {
        marginBottom: 18
    },

    sectionMyConnections: {}
});

export default Section
