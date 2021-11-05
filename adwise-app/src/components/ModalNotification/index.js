import React, {PureComponent} from "react";
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import Modal from "react-native-modal";

const { width } = Dimensions.get('window');

class ModalNotification extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            message: "",

            isOpen: false,
        }
    }

    onOpen = ({title, message, duration, type}) => {
        this.setState({
            title,
            message,
            isOpen: true,
        }, () => {
            setTimeout(() => {
                this.setState({ isOpen: false })
            }, duration);
        })
    }
    onClose = () => {
        this.setState({
            isOpen: false
        })
    }

    render() {
        const {title, message, isOpen} = this.state;

        console.log('this.state: ', this.state);

        if (!isOpen) {
            return null
        }

        return (
            <View style={styles.modal}>

                <View style={styles.root}>

                    <Text style={styles.title}>{title || 'Системное уведомление'}</Text>

                    <Text style={styles.message}>{message || 'Сообщение пользователя'}</Text>

                    <TouchableOpacity style={styles.button} onPress={this.onClose}>
                        <Text style={styles.buttonText}>Закрыть</Text>
                    </TouchableOpacity>

                </View>

                <TouchableOpacity style={styles.backdrop} onPress={this.onClose}/>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,

        margin: 0,
        padding: 0,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },

    backdrop: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: -1
    },

    root: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 10,
        backgroundColor: 'white',
        width: width * 0.8
    },

    title: {
        fontFamily: "AtypText_medium",
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 8
    },
    message: {
        fontFamily: "AtypText",
        fontSize: 12,
        lineHeight: 16,
    },

    button: {
        marginTop: 16,

        width: "100%",
        height: 30,
        borderWidth: 1,
        borderRadius: 10,
        borderStyle: 'solid',
        borderColor: '#8152E4',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 16,
        color: '#8152E4',
    }

});

export default ModalNotification
