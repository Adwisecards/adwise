import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ImageBackground
} from 'react-native';
import Modal from "react-native-modal";

import ModalBackground from '../../../../../assets/graphics/certificates/modal_background.jpg';

const ModalCertificates = (props) => {
    const { isOpen } = props;

    return (
        <Modal
            isVisible={isOpen}
            backdropOpacity={1}

            backdropColor='transparent'

            animationIn={'pulse'}
            animationOut={'pulse'}

            animationInTiming={1}
            animationOutTiming={1}

            style={styles.modal}
        >
            <ImageBackground style={styles.root} source={ModalBackground}>

            </ImageBackground>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        padding: 0,
        margin: 0
    },

    root: {
        flex: 1
    },
});

export default ModalCertificates
