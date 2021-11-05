import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import Modal from 'react-native-modal';
import PersonalCard from "../Cards/PersonalCard";

const ModalCard = (props) => {
    const { isOpen, onClose, card } = props;

    if (!card){
        return null
    }

    return (
        <View>
            <Modal
                isVisible={isOpen}
                backdropColor={'black'}
                backdropOpacity={0.5}

                onBackButtonPress={onClose}
                onBackdropPress={onClose}
            >
                <View style={styles.container}>
                    <PersonalCard {...card}/>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ModalCard
