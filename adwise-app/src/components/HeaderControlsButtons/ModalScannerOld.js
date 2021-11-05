import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {Camera} from 'expo-camera';
import {
    Icon
} from 'native-base';
import imageSquare from '../../../assets/graphics/common/scanner_square.png';
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import getError from "../../helper/getErrors";
import queryString from "query-string";
import {scanQrCodeOrganization} from "../../common/scannerQrCodes";

import DropDownHolder from "../DropDownHolder/DropDownHolder";
import {scanningQrCode} from "../../scanner";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const qrSize = deviceWidth * 0.7;

const ModalScanner = (props) => {
    const {isOpen, onClose, setOpenLoading} = props;
    const [hasPermission, setHasPermission] = useState(null);
    const [activeScan, setActiveScan] = useState(true);
    const [ratios, setRatios] = useState(['16:9']);
    const refCam = useRef();

    useEffect(() => {
        (async () => {
            const {statusBarCode} = await BarCodeScanner.requestPermissionsAsync();

            setHasPermission(statusBarCode === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = (event) => {

        // scanningQrCode(event);

        setActiveScan(false);

        if (event.data.indexOf('https://') > -1) {
            ( async () => {
                await handleParseUrlSite(event.data);
            })();

            return null
        }

        let data = JSON.parse(event.data);

        if (data.mode === 'contact') {

            // Сканирование личной визитки пользователя
            if (data.type === 'personal') {
                props.navigation.navigate('PersonalExchaner', data);
            }

            // Сканирование рабочей визитки пользователя
            if (data.type === 'work' || data.type === 'request') {
                props.navigation.navigate('PersonalExchaner', data);
            }
        }
        if (data.mode === 'organization') {
            // Приглашение на подписание организации без приглашения
            if (data.type === 'subscription'){
                (async () => {
                    await oldhandleOrganizationSubscription(data);
                })();
            }

            // Приглашение на подписание организации с приглашения
            if (data.type === 'invitation'){
                (async () => {
                    await handleOrganizationInvitation(data);
                })();
            }
        }
        if (data.mode === 'purchase'){
            if (data.type === 'create') {
                handleCreatePurchase(data);
            }
        }

        // Приглавшение на подписание купона у организации
        if (data.mode === 'coupon'){
            (async () => {
                await handleGetCouponFromRef(data.ref);
            })();
        }

        handleCloseModal();
    }
    const handleCloseModal = () => {
        setTimeout(() => {
            setActiveScan(true);
        }, 1000);

        onClose();
    }

    const handleParseUrlSite = async (url) => {
        setActiveScan(false);
        setOpenLoading(true);

        const codeRef = url.split('adwise.cards/ref/').pop();

        const ref = await axios('get', `${ urls["get-ref"] }${ codeRef }`).then((response) => {
            return response.data.data.ref
        }).catch((error) => {
            return null
        });

        if (!ref) {
            alert('Неподдерживаемый QR код');

            setActiveScan(true);
            setOpenLoading(false);


            return null
        }

        onClose();
        setOpenLoading(false);
        setActiveScan(true);

        switch (ref.mode) {
            case "contact": {
                props.navigation.navigate('PersonalExchaner', {
                    ref: ref.ref
                });

                break
            }
            case "purchase": {
                props.navigation.navigate('PaymentPurchase', {
                    purchaseId: ref.ref
                });


                break
            }
        }
    }

    const handleOrganizationSubscription = async (data) => {
        const organization = await axios('get', urls["get-ref"] + data.ref).then(response => {
            return response.data.data.organization
        }).catch(() => { return null });
    }
    const handleOrganizationInvitation = async (data) => {
        setOpenLoading(true);

        const organization = await axios('get', urls["get-organization-by-invitation"] + data.ref).then(response => {
            return response.data.data.organization
        }).catch(() => { return null });

        props.navigation.navigate('CompanyPageMain', {
            organizationId: organization._id,
            invitation: data.ref
        });

        setOpenLoading(false);
    }

    const oldhandleOrganizationSubscription = async (data) => {
        setOpenLoading(true);

        let account = props.app.account;
        let accountId = props.app.activeCutaway;
        if (!accountId) {
            accountId = account.contacts[0]._id;
        }

        const response = await axios('put', urls["subscribe-to-organization"] + data.ref, {
            contactId: accountId
        }).then(response => {
            return true
        }).catch(error => {
            setOpenLoading(false);

            DropDownHolder.dropDown.alertWithType('error', 'Ошибка', 'Вы уже подписанны на организацию');

            return null
        })

        if (!response){
            return null
        }

        await handleUpdateAccount();

        setOpenLoading(false);

        props.navigation.navigate('CompanyPageMain', {
            organizationId: data.ref,
        });
    };
    const oldhandleOrganizationInvitation = async (data) => {
        setOpenLoading(true);

        let account = props.app.account;
        let accountId = props.app.activeCutaway;
        if (!accountId) {
            accountId = account.contacts[0]._id;
        }

        const organization = await axios('get', urls["get-organization-by-invitation"] + data.ref).then(response => {
            return response.data.data.organization
        }).catch(() => { return null });

        if (!organization){
            DropDownHolder.dropDown.alertWithType('error', 'Ошибка', 'Организация не найдена');
            setOpenLoading(false);

            return null
        }

        const response = await axios('put', urls["subscribe-to-organization"] + organization._id, {
            contactId: accountId,
            invitationId: data.ref
        }).then(response => {
            return true
        }).catch(error => {
            setOpenLoading(false);

            DropDownHolder.dropDown.alertWithType('error', 'Ошибка', 'Вы уже подписанны на организацию');

            return null
        })

        if (!response){
            return null
        }

        await handleUpdateAccount();

        setOpenLoading(false);

        props.navigation.navigate('CompanyPageMain', {
            organizationId: organization._id,
        });
    };

    const handleCreatePurchase = (data) => {
        let account = props.app.account;
        let accountId = props.app.activeCutaway;
        if (!accountId) {
            accountId = account.contacts[0]._id;
        }

        const body = {
            purchaserContactId: accountId
        };

        axios('put', `${ urls['create-purchase-as-user'] }/${ data.ref }`, body).then((response) => {
            props.navigation.navigate('PaymentPurchase', {
                purchaseId: response.data.data.purchaseId
            })
        }).catch((error) => {
            const errorBody = getError(error.response);
            DropDownHolder.dropDown.alertWithType('error', errorBody.title, errorBody.message);
        })
    }

    const handleGetCouponFromRef = async (couponId) => {
        setOpenLoading(true);

        let account = props.app.account;
        let activeCutaway = props.app.activeCutaway;
        let contact = {};

        if (activeCutaway) {
            contact = account.contacts.find(contact => contact._id === activeCutaway)
        } else {
            contact = account.contacts[0]
        }
        if (!contact){
            DropDownHolder.dropDown.alertWithType('error', 'Ошибка', 'Не найдена активная визитная карточка');
            return null
        }

        const coupon = await axios('get', `${ urls["get-coupon"] }${ couponId }`).then((response) => {
            return response.data.data.coupon
        }).catch((error) => {
            return null
        });
        const organizationSubscription = await axios('put', `${ urls["subscribe-to-organization"] }${ coupon.organization }`, {
            contactId: contact._id
        }).then((response) => {
            return ''
        }).catch((error) => {
            return null
        });
        const couponSubscription = await axios('put', `${ urls["add-coupon-to-contact"] }${ coupon }`, {
            contactId: contact._id
        }).then((response) => {
            return ''
        }).catch((error) => {
            return null
        });

        await handleUpdateAccount();

        setOpenLoading(false);

        props.navigation.navigate('CouponPage', {
            couponId
        })
    }

    const handleUpdateAccount = async () => {
        const userAccount = await axios('get', urls["get-me"]).then((response) => {
            return response.data.data.user
        });

        props.updateAccount(userAccount);
    }

    return (
        <Modal
            isVisible={isOpen}
            backdropOpacity={1}

            animationIn={'pulse'}
            animationOut={'pulse'}

            animationInTiming={1}
            animationOutTiming={1}

            style={styles.modal}

            onBackButtonPress={handleCloseModal}
            onBackdropPress={handleCloseModal}

            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}
        >
            <Camera
                ref={refCam}

                style={{flex: 1}}
                onBarCodeScanned={(activeScan) ? handleBarCodeScanned : null}
                playSoundOnCapture
                ratio={ratios}
                barCodeScannerSettings={{
                    barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
                }}
            >
                <View style={styles.root}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{allTranslations(localization.dashboardQrCodeTitle)}</Text>
                    </View>

                    <View style={styles.imageSquareContainer}>
                        <Image
                            style={styles.imageSquare}
                            source={imageSquare}
                            resizeMode={'contain'}
                        />
                    </View>

                    <TouchableOpacity style={styles.buttonExit} onPress={handleCloseModal}>
                        <Icon name={'close'} type={"MaterialIcons"} style={{color: 'white'}}/>
                    </TouchableOpacity>
                </View>
            </Camera>
        </Modal>
    )
}

const styles = StyleSheet.create({
    root: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    modal: {
        flex: 1,
        margin: 0,
        padding: 0
    },

    title: {
        flex: 1,
        fontSize: 24,
        lineHeight: 26,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'AtypText_medium'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    container: {
        flex: 1,
        alignItems: 'center'
    },

    barCodeScannerContainer: {
        width: qrSize,
        height: qrSize,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden'
    },
    barCodeScanner: {
        flex: 1,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        position: 'absolute'
    },

    buttonCode: {
        marginTop: 24,
        marginBottom: 40,

        width: qrSize,
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#8152e480',
    },
    buttonCodeText: {
        fontSize: 20,
        lineHeight: 22,
        fontFamily: 'AtypText_medium',
        color: 'white',
        textAlign: 'center'
    },

    imageSquare: {
        width: qrSize,
        height: qrSize
    },
    imageSquareContainer: {
        position: 'relative',
        zIndex: 999
    },

    backgroundColor: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,

        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },

    buttonExit: {
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

    background: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
})

export default ModalScanner
