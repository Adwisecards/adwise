import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet
} from 'react-native';
import Modal from "react-native-modal";
import urls from "../../constants/urls";
import {generateQrCode} from "../../helper/generateQrCode";
import UserCardModal from './UserCardModal';

const { width, height } = Dimensions.get('window');
const widthCard = width - 24;

const ModalPersonal = (props) => {
    const { isOpen, onClose, navigation } = props;
    let { user } = props;

    const color = '#007BED';

    if (!user){
        return null
    }

    delete user.ref;

    return (
        <Modal
            isVisible={isOpen}
            backdropOpacity={0.5}

            animationIn={'pulse'}
            animationOut={'pulse'}

            animationInTiming={1}
            animationOutTiming={1}

            onBackButtonPress={onClose}
            onBackdropPress={onClose}

            style={styles.root}
        >
            <UserCardModal widthCard={widthCard} {...user} {...props} onClose={onClose}/>
        </Modal>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default ModalPersonal
