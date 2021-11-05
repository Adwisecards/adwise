import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,

    SafeAreaView,
    FlatList,
} from 'react-native';
import {
    Icon
} from 'native-base';
import MyConnectionCard from './MyConnectionCard';
import Modal from "react-native-modal";

const { width } = Dimensions.get('window');
const widthSmallCard = ( width / 2 - 18);

const TaskParticipants = (props) => {
    const { activeParticipants, myConnections, onChangeParticipants } = props;
    const [openModalParticipants, setOpenModalParticipants] = useState(false);

    const handleRemoveParticipants = (participant) => {
        let id = participant._id;
        let newActiveParticipants = [...activeParticipants];

        newActiveParticipants.splice(newActiveParticipants.indexOf(id), 1)

        onChangeParticipants(newActiveParticipants)
    }

    const handleAddParticipants = (participant) => {
        let id = participant._id;
        let newActiveParticipants = [...activeParticipants];

        if ( newActiveParticipants.indexOf(id) > -1 ){
            newActiveParticipants.splice(newActiveParticipants.indexOf(id), 1)
        }else{
            newActiveParticipants.push(id)
        }

        onChangeParticipants(newActiveParticipants)
    }

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Участники задачи</Text>

            <View style={styles.sections}>
                {
                    activeParticipants.map((item, idx) => (
                        <View style={{ width: widthSmallCard, marginLeft: 12, marginBottom: 12 }}>
                            <MyConnectionCard
                                key={'my-connection-card-' + idx}
                                contactId={item}
                                onPress={handleRemoveParticipants}
                                noMargin

                                remove
                            />
                        </View>
                    ))
                }
            </View>

            <TouchableOpacity style={styles.buttonAdd} onPress={() => setOpenModalParticipants(true)}>
                <Icon style={styles.buttonAddIcon} type={"MaterialIcons"} name={'add-circle'}/>

                <Text style={styles.buttonAddText}>Добавить ещё</Text>
            </TouchableOpacity>

            <Modal
                isVisible={openModalParticipants}
                backdropOpacity={0.5}

                animationIn={'pulse'}
                animationOut={'pulse'}

                animationInTiming={1}
                animationOutTiming={1}

                onBackButtonPress={() => setOpenModalParticipants(false)}
                onBackdropPress={() => setOpenModalParticipants(false)}
            >
                <SafeAreaView style={{ paddingBottom: 12 }}>
                    <FlatList
                        data={myConnections}

                        contentContainerStyle={{ paddingTop: 24 }}

                        keyExtractor={item => item}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        renderItem={(item) => (
                            <View style={{ marginBottom: 8 }}>
                                <MyConnectionCard
                                    contactId={item.item}
                                    noMargin
                                    activeParticipants={activeParticipants}
                                    onPress={handleAddParticipants}
                                />
                            </View>
                        )}
                    />

                    <TouchableOpacity style={stylesModal.buttonExit} onPress={() => setOpenModalParticipants(false)}>
                        <Text style={stylesModal.buttonExitText}>Закрыть</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>

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