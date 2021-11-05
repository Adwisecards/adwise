import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native';
import MyConnectionCard from './MyConnectionCard';

const { width } = Dimensions.get('window');
const widthSmallCard = ( width / 2 - 18);

const TaskParticipants = (props) => {
    const { activeParticipants, onChangeParticipants } = props;

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Участники задачи</Text>

            <View style={styles.sections}>
                {
                    activeParticipants.map((item, idx) => (
                        <View key={`tast-parting-${ idx }`} style={{ width: widthSmallCard, marginLeft: 12 }}>
                            <MyConnectionCard
                                key={'my-connection-card-' + idx}
                                contactId={item}
                                noMargin
                            />
                        </View>
                    ))
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {},

    title: {
        marginBottom: 16,
        fontFamily: 'AtypText_semibold',
        fontSize: 20,
        lineHeight: 22
    },

    sections: {
        flexDirection: 'row',
        flexWrap: 'wrap',

        marginBottom: 12,
        marginLeft: -12
    },

    buttonAdd: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonAddIcon: {
        color: '#8152E4',
        marginRight: 12
    },
    buttonAddText: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 18,
        opacity: 0.7,
        letterSpacing: 0.01,
    },
})
const stylesModal = StyleSheet.create({
    root: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 4
    },

    buttonExit: {
        width: '100%',
        padding: 16,
        borderRadius: 10,
        backgroundColor: '#8152E4'
    },
    buttonExitText: {
        fontFamily: 'AtypText_semibold',
        color: 'white',
        fontSize: 14,
        lineHeight: 15,
        letterSpacing: 0.195,
        textTransform: 'uppercase',
        textAlign: 'center'
    }
})

export default TaskParticipants
