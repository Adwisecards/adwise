import React, {PureComponent} from "react";
import {
    View,
    Text,
    Platform,
    Dimensions,
    StyleSheet,
    TextInput,

    Image,

    TouchableOpacity,
    TouchableNativeFeedback
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
import {DropDownHolder} from "../index";

import Modal from "react-native-modal";
import getHeightStatusBar from "../../helper/getHeightStatusBar";
import DropdownAlert from "react-native-dropdownalert";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import getError from "../../helper/getErrors";
import ImageNotPermission from "../../../assets/graphics/common/not_permission_camera.png";
import Page from "../Page";
import * as Linking from "expo-linking";

const {width, height} = Dimensions.get('window');
const heightStatusBar = getHeightStatusBar();

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
        this.props.navigation.addListener('didFocus', async () => {
            await this.checkPermission()
        });
    }

    checkPermission = async () => {
        const { status } = await Camera.requestPermissionsAsync();

        this.setState({
            isPermission: Boolean(status === 'granted')
        })
    }

    onFindRefFromCode = async () => {
        const {code} = this.state;
        const codeNumber = String(code.replace(/[^\d]/g, ''));

        const ref = await this.getRefFromCode(codeNumber);

        if (!ref) {
            this.modalDropDown.current.alertWithType('error', "Системное уведомление", "Данный код не найден в системе", 3000);

            return null
        }

        this.setState({isOpenWriteCode: false, code: ""})

        await this.onTreatment({
            mode: ref.mode,
            ref: ref.ref,
            type: ref.type
        });
    }

    onBarCodeScanned = async ({data}) => {
        this.setState({activeScan: false})

        const isQrCodeVersionTwo = data.indexOf('http') > -1;

        if (!isQrCodeVersionTwo) {
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
            setTimeout(() => {
                this.setState({activeScan: true})
            }, 1000)

            return null
        }

        const code = url.split('adwise.cards/ref/').pop();

        const ref = await this.getRefFromCode(code);

        if (!ref) {
            this.modalDropDown.current.alertWithType('error', "Системное уведомление", "Данный QR код не найден в системе", 3000);
            setTimeout(() => {
                this.setState({activeScan: true})
            }, 1000)

            return null
        }

        await this.onTreatment({
            mode: ref.mode,
            ref: ref.ref,
            type: ref.type
        });
    }

    getRefFromCode = async (code) => {
        return await axios('get', `${urls["get-ref"]}${code}`).then((response) => {
            return response.data.data.ref
        }).catch((error) => {
            return null
        })
    }

    // Обработка QR кодов
    onTreatment = async (data) => {
        if (data.mode === 'organization' && data.type === 'invitation') {
            await this.onOrganizationInvitation(data);

            return null
        }
        if (data.mode === 'organization' && data.type === 'subscription') {
            setTimeout(() => {
                this.setState({activeScan: true});
            }, 2000);

            await this.onOrganizationSubscription(data);

            return null
        }
        if (data.mode === 'coupon' && data.type === 'purchase') {
            await this.onCouponPurchase(data);

            return null
        }
        if (data.mode === 'contact' && data.type === 'personal') {
            setTimeout(() => {
                this.setState({activeScan: true});
            }, 2000);

            await this.onContactPersonal(data);

            return null
        }
        if (data.mode === 'contact' && data.type === 'work') {
            setTimeout(() => {
                this.setState({activeScan: true});
            }, 2000);

            await this.onContactWork(data);

            return null
        }
        if (data.mode === 'purchase' && data.type === 'create') {
            await this.onPurchaseCreate(data);

            return null
        }
    }

    onOrganizationInvitation = async (data) => {
        const organization = await axios('get', `${urls["get-organization-by-invitation"]}${data.ref}`).then((response) => {
            return response.data.data.organization
        }).catch((error) => {
            return null
        });

        setTimeout(() => {
            this.setState({activeScan: true});
        }, 2000);

        if (!organization) {
            this.modalDropDown.current.alertWithType('error', "Системное уведомление", "Данная ораганизация не найдена в системе", 3000);

            return null
        }

        this.props.onClose();

        this.props.navigation.navigate('CompanyPageMain', {
            organizationId: organization._id,
            invitation: data.ref
        });
    }
    onOrganizationSubscription = async (data) => {
        this.props.onClose();

        this.props.navigation.navigate('CompanyPageMain', {
            organizationId: data.ref
        });
    }
    onCouponPurchase = async (data) => {
        const coupon = await axios('get', `${urls["get-coupon"]}${data.ref}`).then((response) => {
            return response.data.data.coupon
        }).catch(() => {
            return null
        });

        setTimeout(() => {
            this.setState({activeScan: true});
        }, 2000);

        if (!coupon) {
            this.modalDropDown.current.alertWithType('error', "Системное уведомление", "Данный купон не найден в системе", 3000);

            return null
        }

        this.props.onClose();

        this.props.navigation.navigate('CompanyPageMain', {
            organizationId: coupon.organization,
            couponId: coupon._id,

            isNextCoupon: true
        });
    }
    onContactPersonal = async (data) => {
        this.props.onClose();

        this.props.navigation.navigate('PersonalExchaner', data);
    }
    onContactWork = async (data) => {
        this.props.onClose();

        this.props.navigation.navigate('PersonalExchaner', data);
    }
    onPurchaseCreate = async (data) => {
        let account = this.props.app.account;
        let accountId = this.props.app.activeCutaway;
        if (!accountId) {
            accountId = account.contacts[0]._id;
        }

        const body = {
            purchaserContactId: accountId
        };

        setTimeout(() => {
            this.setState({activeScan: true});
        }, 2000);

        axios('put', `${urls['create-purchase-as-user']}/${data.ref}`, body).then((response) => {
            this.props.navigation.navigate('PaymentPurchase', {
                purchaseId: response.data.data.purchaseId
            })
        }).catch((error) => {
            const errorBody = getError(error.response);
            this.modalDropDown.current.alertWithType('error', errorBody.title, errorBody.message);
        })
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
        const {code, activeScan, isPermission, isOpenWriteCode} = this.state;
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

                            <Button onPress={() => this.setState({isOpenWriteCode: true})}>
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

                        onBackButtonPress={() => this.setState({isOpenWriteCode: false})}
                        onBackdropPress={() => this.setState({isOpenWriteCode: false})}
                    >
                        <View style={styles.modalWriteCodeContainer}>
                            <Text style={styles.modalWriteCodeTitle}>Введите код</Text>

                            <TextInputMask
                                value={code}
                                onChangeText={(code) => this.setState({code})}

                                style={styles.modalWriteCodeInput}

                                keyboardType={'phone-pad'}
                                placeholder="000-00-000"

                                type={'custom'}
                                options={{mask: "999-99-999"}}
                            />

                            <Button disabled={code.length !== 10} onPress={this.onFindRefFromCode}>
                                <View
                                    style={[styles.modalWriteCodeButton, Boolean(code.length !== 10) && styles.modalWriteCodeButtonDisabled]}>
                                    <Text style={styles.modalWriteCodeButtonText}>Ввести</Text>
                                </View>
                            </Button>

                        </View>
                    </Modal>

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

    imageNotPermission: {
        width: width * 0.5,
        height: width * 0.45,
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
});

export default ModalScanner
