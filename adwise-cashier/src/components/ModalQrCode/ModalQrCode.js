import React, {PureComponent} from "react";
import {
    View,
    Text,
    Platform,
    Dimensions,
    StyleSheet,
    TextInput,

    TouchableOpacity,
    TouchableNativeFeedback, Image
} from "react-native";
import {BarCodeScanner} from 'expo-barcode-scanner';
import {Camera} from "expo-camera";
import {
    AngleBottomLeft as AngleBottomLeftIcon,
    AngleBottomRight as AngleBottomRightIcon,
    AngleTopLeft as AngleTopLeftIcon,
    AngleTopRight as AngleTopRightIcon
} from "../../icons";
import {
    Icon
} from "native-base";
import {TextInputMask} from "react-native-masked-text";

import * as Linking from "expo-linking";
import Modal from "react-native-modal";
import DropdownAlert from "react-native-dropdownalert";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import ImageNotPermission from "../../../assets/graphics/common/not_permission_camera.png";

const {width, height} = Dimensions.get('window');

class ModalScanner extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            code: "",

            activeScan: true,
            isPermission: true,
            isOpenWriteCode: false
        };

        this.modalDropDown = React.createRef();
    }

    componentDidMount = async () => {
        await this.checkPermission();
    }

    checkPermission = async () => {
        const { status } = await Camera.requestPermissionsAsync();

        this.setState({
            isPermission: Boolean(status === 'granted')
        })
    }

    onFindRefFromCode = async () => {
        const { code } = this.state;
        const codeNumber = String(code.replace(/[^\d]/g, ''));

        const ref = await this.getRefFromCode(codeNumber);

        if (!ref) {
            this.modalDropDown.current.alertWithType('error', "Системное уведомление", "Данный код не найден в системе", 3000);

            return null
        }

        this.setState({ isOpenWriteCode: false, code: "" })

        await this.onTreatment({
            mode: ref.mode,
            ref: ref.ref,
            type: ref.type
        });
    }
    onBarCodeScanned = async ({ data }) => {
        this.setState({ activeScan: false })

        const isQrCodeVersionTwo = data.indexOf('http') > -1;

        if (!isQrCodeVersionTwo){
            await this.onScanQrCodeVersionOne(JSON.parse(data));

            return null
        }

        await this.onScanQrCodeVersionTwo(data);
    }

    onScanQrCodeVersionOne = async (props) => {
        await this.onTreatment(props);
    }
    onScanQrCodeVersionTwo = async (url) => {
        if (url.indexOf('adwise.cards/ref/') <= -1) {
            this.modalDropDown.current.alertWithType('error', "Системное уведомление", "Данный QR код не поддерживается системой", 3000);
            setTimeout(() => { this.setState({ activeScan: true }) }, 1000)

            return null
        }

        const code = url.split('adwise.cards/ref/').pop();

        const ref = await this.getRefFromCode(code);

        if (!ref) {
            this.modalDropDown.current.alertWithType('error', "Системное уведомление", "Данный QR код не найден в системе", 3000);
            setTimeout(() => { this.setState({ activeScan: true }) }, 1000)

            return null
        }

        await this.onTreatment({
            mode: ref.mode,
            ref: ref.ref,
            type: ref.type
        });
    }

    getRefFromCode = async (code) => {
        return await axios('get', `${ urls["get-ref"] }${ code }`).then((response) => {
            return response.data.data.ref
        }).catch((error) => {
            return null
        })
    }

    // Обработка QR кодов
    onTreatment = async (data) => {
        if (data.mode !== 'purchase'){
            this.modalDropDown.current.alertWithType('error', "Системное уведомление", "Поддерживаются только QR коды покупок", 3000);

            return null
        }

        this.setState({ activeScan: true });
        this.props.onEventScann(data.ref);
        this.props.onClose();
    }

    _routeSettingApp = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL(`app-settings:`);
        } else {
            Linking.openSettings();
        }
    }

    render() {
        const {isOpen, onClose} = this.props;
        const {isPermission, code, activeScan, isOpenWriteCode} = this.state;
        const Button = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

        if (!isPermission) {
            return (
                <>
                    <Modal
                        isVisible={isOpen}
                        backdropColor={'black'}
                        backdropOpacity={0.8}

                        animationIn={'pulse'}
                        animationOut={'pulse'}

                        animationInTiming={1}
                        animationOutTiming={1}

                        onBackdropPress={onClose}
                        onBackButtonPress={onClose}

                        style={{padding: 0, margin: 0}}
                    >
                        <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 16}}>
                            <Image
                                style={styles.imageNotPermission}
                                source={ImageNotPermission}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.title}>{`У приложения\nнет доступа к камере.`}</Text>
                        <Text style={styles.title}>{`Включите данную опцию\nв настройках приложения`}</Text>

                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity
                                style={[styles.buttonEntryCode, {backgroundColor: 'rgba(129, 82, 228, 1)'}]}
                                onPress={this._routeSettingApp}
                            >
                                <Text style={styles.buttonEntryCodeText}>Настройки</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.buttonEntryCode, {marginTop: 8, backgroundColor: "transparent", borderWidth: 1, borderStyle: "solid", borderColor: 'rgba(129, 82, 228, 1)'}]}
                                onPress={this.checkPermission}
                            >
                                <Text style={[styles.buttonEntryCodeText, {color: "rgba(129, 82, 228, 1)"}]}>Обновить</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </>
            )
        }

        return (
            <>
                <Modal
                    isVisible={isOpen}
                    backdropColor={'black'}
                    backdropOpacity={0}

                    animationIn={'pulse'}
                    animationOut={'pulse'}

                    animationInTiming={1}
                    animationOutTiming={1}

                    style={{padding: 0, margin: 0}}
                >

                    <DropdownAlert
                        ref={this.modalDropDown}
                        updateStatusBar={true}

                        closeInterval={5000}
                        zIndex={9999999999999}

                        infoColor={'#ED8E00'}
                        errorColor={'#EA2424'}
                        successColor={'#61AE2C'}

                        translucent
                    />

                    <Camera
                        style={{flex: 1, position: 'relative', zIndex: 1}}
                        onBarCodeScanned={activeScan ? this.onBarCodeScanned : null}
                        playSoundOnCapture
                        ratio={['16:9']}
                        barCodeScannerSettings={{
                            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
                        }}
                    >
                        <View style={styles.header}>
                            <Text style={styles.title}>{`Поместите\nQR-код в рамку`}</Text>
                        </View>
                        <View style={styles.body}>
                            <View style={styles.bodyBackground}/>
                            <View style={styles.scanContainer}>
                                <AngleBottomLeftIcon style={styles.angleBottomLeftIcon}/>
                                <AngleBottomRightIcon style={styles.angleBottomRightIcon}/>
                                <AngleTopLeftIcon style={styles.angleTopLeftIcon}/>
                                <AngleTopRightIcon style={styles.angleTopRightIcon}/>
                            </View>
                            <View style={styles.bodyBackground}/>
                        </View>
                        <View style={styles.footer}>

                            <Button onPress={() => this.setState({ isOpenWriteCode: true })}>
                                <View style={styles.buttonEntryCode}>
                                    <Text style={styles.buttonEntryCodeText}>Ввести код вручную</Text>
                                </View>
                            </Button>

                            <View style={{marginTop: 32}}/>

                            <Button onPress={onClose}>
                                <View style={styles.buttonClose}>
                                    <Icon type="Feather" name="x" style={{color: 'white'}}/>
                                </View>
                            </Button>

                        </View>
                    </Camera>

                    <Modal
                        isVisible={isOpenWriteCode}
                        backdropColor={'black'}
                        backdropOpacity={0.5}

                        animationIn={'pulse'}
                        animationOut={'pulse'}

                        animationInTiming={1}
                        animationOutTiming={1}

                        style={styles.modalWriteCode}

                        onBackButtonPress={() => this.setState({ isOpenWriteCode: false })}
                        onBackdropPress={() => this.setState({ isOpenWriteCode: false })}
                    >
                        <View style={styles.modalWriteCodeContainer}>
                            <Text style={styles.modalWriteCodeTitle}>Введите код</Text>

                            <TextInputMask
                                value={code}
                                onChangeText={(code) => this.setState({ code })}

                                style={styles.modalWriteCodeInput}

                                keyboardType={'phone-pad'}
                                placeholder="000-00-000"

                                type={'custom'}
                                options={{ mask: "999-99-999" }}
                            />

                            <Button disabled={code.length !== 10} onPress={this.onFindRefFromCode}>
                                <View style={[styles.modalWriteCodeButton, Boolean(code.length !== 10) && styles.modalWriteCodeButtonDisabled]}>
                                    <Text style={styles.modalWriteCodeButtonText}>Ввести</Text>
                                </View>
                            </Button>

                        </View>
                    </Modal>

                    {
                        Boolean(!activeScan) && (
                            <View style={styles.loadingContainer}>
                                <Text style={styles.loadingContainerMessage}>Идет загрузка заказа</Text>
                                <Text style={styles.loadingContainerMessage}>Пожалуйста, подождите...</Text>
                            </View>
                        )
                    }

                </Modal>
            </>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    body: {
        position: 'relative',
        zIndex: 999,
        flexDirection: 'row',
    },
    bodyBackground: {
        position: 'relative',
        zIndex: -1,
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    footer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

        alignItems: 'center',
        paddingTop: 48
    },

    scanContainer: {
        width: width * 0.6,
        height: width * 0.6,
        position: 'relative'
    },
    angleBottomLeftIcon: {
        position: 'absolute',
        bottom: -24,
        left: -24
    },
    angleBottomRightIcon: {
        position: 'absolute',
        bottom: -24,
        right: -24
    },
    angleTopLeftIcon: {
        position: 'absolute',
        top: -24,
        left: -24
    },
    angleTopRightIcon: {
        position: 'absolute',
        zIndex: 10,
        top: -24,
        right: -24
    },

    title: {
        marginBottom: 24,

        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        lineHeight: 26,
        fontFamily: 'AtypText_medium'
    },

    buttonEntryCode: {
        backgroundColor: 'rgba(129, 82, 228, 0.5)',
        borderRadius: 10,

        height: 48,
        width: width * 0.6,

        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonEntryCodeText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        lineHeight: 18,
        fontFamily: 'AtypText_medium'
    },

    buttonClose: {
        width: 50,
        height: 50,
        borderRadius: 999,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',

        justifyContent: 'center',
        alignItems: 'center'
    },

    modalWriteCode: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalWriteCodeContainer: {
        width: width * 0.8,
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 10
    },
    modalWriteCodeTitle: {
        // textAlign: 'center',
        color: 'black',
        fontSize: 16,
        lineHeight: 18,
        fontFamily: 'AtypText_medium',

        marginBottom: 12
    },
    modalWriteCodeInput: {
        color: 'black',
        fontSize: 16,
        lineHeight: 18,
        fontFamily: 'AtypText',

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: 10,

        paddingHorizontal: 18,
        paddingVertical: 8,
        marginBottom: 8
    },
    modalWriteCodeButton: {
        backgroundColor: 'rgba(129, 82, 228, 1)',
        borderRadius: 10,
        height: 40,
        width: '100%',

        justifyContent: 'center',
        alignItems: 'center'
    },
    modalWriteCodeButtonDisabled: {
        backgroundColor: 'rgba(129, 82, 228, 0.1)',
    },
    modalWriteCodeButtonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        lineHeight: 18,
        fontFamily: 'AtypText_medium'
    },

    loadingContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(37, 35, 62, 0.8)",
        zIndex: 999999,
        justifyContent: "center",
        alignItems: "center"
    },
    loadingContainerMessage: {
        fontFamily: "AtypText_medium",
        fontSize: 20,
        lineHeight: 24,
        textAlign: "center",
        color: "white"
    },
    imageNotPermission: {
        width: width * 0.5,
        height: width * 0.45,
    },
});

export default ModalScanner
