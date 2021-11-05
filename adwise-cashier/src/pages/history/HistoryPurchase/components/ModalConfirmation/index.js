import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";

const ModalConfirmation = (props) => {
    const {isOpen} = props;

    if (!isOpen) {
        return null
    }

    return (
        <Modal
            isVisible={isOpen}
            backdropColor={'#261940'}
            backdropOpacity={0.6}

            animationIn={'pulse'}
            animationOut={'pulse'}

            animationInTiming={1}
            animationOutTiming={1}

            style={{justifyContent: 'center', alignItems: 'center'}}
        >

            <View style={styles.card}>

                {!!props.headerCaption && (
                    <Text style={styles.headerCaption}>{ props.headerCaption }</Text>
                )}

                {!!props.message && (
                    <Text style={styles.message}>{ props.message }</Text>
                )}

                <View style={styles.controls}>
                    <TouchableOpacity style={styles.button} onPress={props.onAccept}>
                        <Text style={styles.buttonText}>Да</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={props.onClose}>
                        <Text style={styles.buttonText}>Нет</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </Modal>
    )
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,

        paddingVertical: 26,
        paddingHorizontal: 40
    },

    headerCaption: {
        marginBottom: 32,

        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 19,
        opacity: 0.4,
        color: '#000000',
        textAlign: 'center'
    },

    message: {
        marginBottom: 40,

        fontFamily: 'AtypText',
        fontSize: 22,
        lineHeight: 26,
        textAlign: 'center'
    },

    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        marginLeft: -16
    },

    button: {
        marginLeft: 16,

        paddingHorizontal: 32,
        paddingVertical: 12,

        borderRadius: 10,

        backgroundColor: '#8152E4'
    },
    buttonCancel: {
        backgroundColor: '#D1C2F1'
    },
    buttonText: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 20,
        color: 'white'
    }
});

ModalConfirmation.defaultProps = {
    isOpen: false,


    headerCaption: '',
    message: '',

    onClose: function () {
    },
    onAccept: function () {
    }
};

export default ModalConfirmation
