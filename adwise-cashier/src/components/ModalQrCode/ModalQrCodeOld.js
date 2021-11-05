import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Alert,
    Image,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import {
    Icon

} from 'native-base';
import {Camera} from 'expo-camera';
import Modal from "react-native-modal";
import {BarCodeScanner} from 'expo-barcode-scanner';

import scannerSquare from '../../../assets/graphics/common/scanner_square.png';
import axios from "../../plugins/axios";
import urls from "../../constants/urls";

const { width } = Dimensions.get('window');

const ModalQrCode = (props) => {
    const { isOpen, onClose, onEventScann } = props;

    const refCam = useRef(null);

    const [ isActiveScanner, setActiveScanner ] = useState(false);
    const [ hasPermission, setHasPermission ] = useState(null);
    const [ isEnterCode, setEnterCode ] = useState(false);

    useEffect(() => {
        handleSetPermission()
    }, []);
    useEffect(() => {
        setActiveScanner(isOpen)
    }, [isOpen]);

    const handleSetPermission = () => {
        (async () => {
            const {statusBarCode} = await BarCodeScanner.requestPermissionsAsync();

            setHasPermission(statusBarCode === 'granted');
        })();
    }
    const handleBarCodeScanned = (event) => {
        setActiveScanner(false);

        let data = event.data;

        if (data.indexOf('adwise.cards/ref/') > -1) {
            (async () => {
                await handleParseUrl(data);
            })();

            return null
        }

        if (!data){
            onClose();
        }

        data = JSON.parse(data);

        if (data.mode !== 'purchase'){
            alert('Поддерживается только QR код покупки');

            return null
        }

        onEventScann(data.ref);
        onClose();
    }
    const handleParseUrl = async (url) => {
        const codeRef = url.split('adwise.cards/ref/').pop();

        const ref = await axios('get', `${ urls["get-ref"] }${ codeRef }`).then((response) => {
            return response.data.data.ref
        }).catch((error) => {
            return null
        });

        if (!ref) {
            alert('QR код не найден');
            onClose();

            return null
        }

        onClose();

        switch (ref.mode) {
            case "purchase": {
                onEventScann(ref.ref);

                break
            }

            default: {
                alert('Поддерживается только QR код покупки');

                return null
            }
        }
    }

    if (!isOpen){
        return null
    }
    // if (!hasPermission){
    //     Alert.alert(
    {/*        "Ошибка",*/}
    {/*        "Вы не предоставили разрешения на использования \"Камера\"",*/}
    //         [
    //             {
    //                 text: "Отмена",
    //                 onPress: onClose,
    //                 style: "cancel"
    //             },
    //             { text: "Предоставить", onPress: handleSetPermission }
    //         ],
    //         { cancelable: false }
    //     )
    // }

    return (
        <Modal
            isVisible={isOpen}
            backdropColor={'black'}
            backdropOpacity={0.5}

            animationIn={'pulse'}
            animationOut={'pulse'}

            animationInTiming={1}
            animationOutTiming={1}

            onBackButtonPress={onClose}
            onBackdropPress={onClose}

            style={styles.modal}
        >
            {
                (isEnterCode) ? (
                    <TextInputCode
                        setEnterCode={setEnterCode}
                        onClose={onClose}
                    />
                ) : (
                    <ScannerQrCode
                        refCam={refCam}
                        setEnterCode={setEnterCode}
                        isActiveScanner={isActiveScanner}
                        handleBarCodeScanned={handleBarCodeScanned}
                        onClose={onClose}
                    />
                )
            }

        </Modal>
    )
}

const TextInputCode = (props) => {
    const { setEnterCode } = props;

    return (
        <View style={styles.root}>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>{
                    `Введите код`
                }</Text>
            </View>

            <View>
                <TextInput
                    style={styles.input}
                    placeholder="111-22-333"
                />
            </View>

            <TouchableOpacity style={styles.buttonExit} onPress={props.onClose}>
                <Icon name={'close'} type={"MaterialIcons"} style={{color: 'white'}}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => setEnterCode(false)}>
                <Text style={styles.buttonText}>Сканировать код</Text>
            </TouchableOpacity>

        </View>
    )
}
const ScannerQrCode = (props) => {
    const { refCam, isActiveScanner, handleBarCodeScanned, setEnterCode } = props;

    return (
        <Camera
            ref={refCam}

            style={{flex: 1}}
            onBarCodeScanned={(isActiveScanner) ? handleBarCodeScanned : null}
            playSoundOnCapture
            ratio={'16:9'}
            barCodeScannerSettings={{
                barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
            }}
        >
            <View style={styles.root}>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{
                        `Поместите\nQR-код в рамку`
                    }</Text>
                </View>

                <Image
                    style={styles.imageScanner}
                    source={scannerSquare}
                />

                <TouchableOpacity style={styles.buttonExit} onPress={props.onClose}>
                    <Icon name={'close'} type={"MaterialIcons"} style={{color: 'white'}}/>
                </TouchableOpacity>

                {/*<TouchableOpacity style={styles.button} onPress={() => setEnterCode(true)}>*/}
                {/*    <Text style={styles.buttonText}>Ввести код вручную</Text>*/}
                {/*</TouchableOpacity>*/}

            </View>
        </Camera>
    )
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        padding: 0
    },

    root: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',

        // backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },

    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        flex: 1,

        fontFamily: 'AtypText_medium',
        fontSize: 24,
        lineHeight: 26,
        color: 'white',
        textAlign: 'center',

        marginBottom: 28,
    },

    imageScanner: {
        width: width * 0.6,
        height: width * 0.6
    },

    input: {
        width: width * 0.6,

        backgroundColor: 'rgba(255, 255, 255, 0.8)',

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(129, 82, 228, 0.75)',
        borderRadius: 5,

        marginBottom: 24,

        paddingHorizontal: 16,
        paddingVertical: 5,

        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 22
    },

    button: {
        paddingHorizontal: 24,
        paddingVertical: 13,

        backgroundColor: 'rgba(129, 82, 228, 0.75)',

        borderRadius: 10
    },
    buttonText: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: 'white'
    },

    buttonExit: {
        marginBottom: 24,

        width: 50,
        height: 50,
        backgroundColor: '#686766',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 3,
    },
})

ModalQrCode.defaultProps = {
    isOpen: false,

    onClose: function (){}
}


export default ModalQrCode
