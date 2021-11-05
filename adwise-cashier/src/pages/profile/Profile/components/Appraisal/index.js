import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import IconRating from "./IconRating";

const Appraisal = (props) => {
    const { workContact } = props;

    const userRating = workContact?.employee?.rating || 0;

    const handleGetPercentActive = (index) => {
        if ( userRating === 0 ){
            return '0%'
        }
        if (index < userRating){
            return '100%'
        }
        if (index >= userRating + 1) {
            return '0%'
        }

        const remainder = 100 - (((index % userRating).toFixed(2)) * 100);

        return `${ remainder }%`
    }

    return (
        <View>

            <Text style={styles.title}>Средняя оценка обслуживания</Text>

            <View style={styles.body}>

                <View style={styles.ratings}>
                    <View style={{ marginLeft: 12, width: 35, height: 35 }}>
                        <IconRating widthActive={handleGetPercentActive(1)}/>
                    </View>
                    <View style={{ marginLeft: 12, width: 35, height: 35 }}>
                        <IconRating widthActive={handleGetPercentActive(2)}/>
                    </View>
                    <View style={{ marginLeft: 12, width: 35, height: 35 }}>
                        <IconRating widthActive={handleGetPercentActive(3)}/>
                    </View>
                    <View style={{ marginLeft: 12, width: 35, height: 35 }}>
                        <IconRating widthActive={handleGetPercentActive(4)}/>
                    </View>
                    <View style={{ marginLeft: 12, width: 35, height: 35 }}>
                        <IconRating widthActive={handleGetPercentActive(5)}/>
                    </View>
                </View>

                <Text style={styles.totalAppraisal}>{ userRating }</Text>

            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    root: {},

    title: {
        fontFamily: 'AtypDisplay',
        fontSize: 14,
        lineHeight: 17,
        color: '#808080',

        marginBottom: 8
    },

    body: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    totalAppraisal: {
        fontFamily: 'AtypText_semibold',
        fontSize: 32,
        lineHeight: 32,
        color: '#8152E4',

        marginBottom: -6
    },

    ratings: {
        flexDirection: 'row',
        alignItems: 'center',

        marginLeft: -12,
        marginRight: 10
    }
});

Appraisal.defaultProps = {
    userRating: 1.0
};

export default Appraisal
