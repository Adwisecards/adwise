import React from "react";
import {
    Share,

    View,

    Text,

    Image,

    StyleSheet,

    Dimensions,

    TouchableOpacity
} from 'react-native';
import Modal from "react-native-modal";
import urls from "../../../../../constants/urls";

const {width, height} = Dimensions.get('window');

const InvitionModal = (props) => {
    const {isOpen, invitation} = props;

    if (!invitation){
        return null
    }

    return (
        <Modal
            isVisible={isOpen}
            backdropColor={'black'}
            backdropOpacity={0.5}

            animationIn={'pulse'}
            animationOut={'pulse'}

            animationInTiming={1}
            animationOutTiming={1}

            onBackButtonPress={props.onClose}
            onBackdropPress={props.onClose}
        >

            <View style={styles.card}>
                <View style={styles.qrCodeContainer}>
                    <Image
                        source={{ uri: invitation.ref.QRCode }}
                        style={styles.qrCode}
                    />
                </View>
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {},

    card: {
        backgroundColor: 'white',
        width: '100%',
        padding: 32,

        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 10
    },

    qrCodeContainer: {
        width: width * 0.6,
        height: width * 0.6
    },

    qrCode: {
        flex: 1
    },

    buttonShare: {
        width: width * 0.6,

        paddingVertical: 8,

        borderRadius: 10,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#f65800'
    },
    buttonShareText: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 18,
        textAlign: 'center',

        color: '#f65800'
    },
});

export default InvitionModal
