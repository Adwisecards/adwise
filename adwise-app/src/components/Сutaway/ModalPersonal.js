import React from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import {
    Icon
} from 'native-base';
import {
    PersonalSmallCard
} from '../../icons';
import Modal from "react-native-modal";
import urls from "../../constants/urls";
import {generateQrCode} from "../../helper/generateQrCode";
import {hexToRGBA} from "../../helper/converting";

const { width } = Dimensions.get('window');

const ModalPersonal = (props) => {
    const { isOpen, onClose, color } = props;
    const handleGenerateQrCode = () => {
        if (!props || !props.requestRef){
            return ''
        }

        return props.requestRef.QRCode;
    }

    return (
        <Modal
            isVisible={isOpen}
            backdropOpacity={0.8}

            animationIn={'pulse'}
            animationOut={'pulse'}

            animationInTiming={1}
            animationOutTiming={1}

            style={[styles.modal, { backgroundColor: hexToRGBA(color, 0.75) }]}

            onBackButtonPress={onClose}
            onBackdropPress={onClose}
        >
            <View style={styles.root}>
                <View style={styles.userContainer}>

                    <View style={[styles.userLogoContainer, { borderColor: color }, (!props.picture || !props.picture.value) && { padding: 0, backgroundColor: color }]}>
                        {
                            ( props.picture && props.picture.value ) ? (
                                <Image source={{ uri: props.picture.value }} style={{ width: 95, height: 95, borderRadius: 999 }}/>
                            ) : (
                                <PersonalSmallCard color={color} width={106} height={106}/>
                            )
                        }
                    </View>

                    <View style={{ marginBottom: 6 }}>
                        { props.firstName && !!props.firstName.value && (<Text style={styles.userTypographyName}>{ (props.firstName) && props.firstName.value }</Text>) }
                        { props.lastName && !!props.lastName.value && (<Text style={styles.userTypographyName}>{ (props.lastName) && props.lastName.value }</Text>) }
                    </View>

                    { props.activity && !!props.activity.value && (<Text style={styles.userTypographyActive}>{ (props.activity) && props.activity.value }</Text>) }
                </View>

                <View style={styles.qrContainer}>
                    <Image source={{ uri: handleGenerateQrCode() }} style={{ flex: 1 }} resizeMode={'contain'}/>
                </View>

                <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
                    <Icon name={'close'} type={"MaterialIcons"} style={{ color: 'white' }}/>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        margin: 0,
        padding: 0
    },

    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    userContainer: {
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },

    userLogoContainer: {
        width: 110,
        height: 110,

        borderRadius: 999,
        backgroundColor: 'white',
        padding: 5,

        marginBottom: 18,

        borderWidth: 3,
        borderStyle: 'solid'
    },

    qrContainer: {
        width: width * 0.7,
        height: width * 0.7,

        padding: 24,

        borderRadius: 8,
        backgroundColor: '#F5F5F7'
    },

    buttonClose: {
        marginTop: 40,

        width: 50,
        height: 50,
        borderRadius: 999,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',

        justifyContent: 'center',
        alignItems: 'center'
    },

    userTypographyName: {
        fontSize: 26,
        lineHeight: 26,
        color: 'white',
        fontFamily: 'AtypText_medium',
        textAlign: 'center'
    },
    userTypographyActive: {
        fontSize: 18,
        lineHeight: 22,
        textAlign: 'center',
        color: 'white',
        opacity: 0.6
    }
});

ModalPersonal.defaultProps = {
    color: '#007BED'
}

export default ModalPersonal
