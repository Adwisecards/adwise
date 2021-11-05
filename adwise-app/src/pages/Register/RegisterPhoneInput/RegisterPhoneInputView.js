import React, {Component} from 'react';
import {
    View,
    Keyboard,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import {
    Text,
    Icon
} from 'native-base';
import {
    DropDownHolder,
    InputPhone,
    Page,
    ModalLoading
} from '../../../components/index';
import commonStyles from '../../../theme/variables/commonStyles';
import {validationPhone} from "../../../helper/helperPhone";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import getError from "../../../helper/getErrors";
import {getItemAsync, setItemAsync} from "../../../helper/SecureStore";
import times from "../../../constants/times";
import getHeightStatusBar from "../../../helper/getHeightStatusBar";
import localization from "../../../localization/localization";
import allTranslations from "../../../localization/allTranslations";
import {
    amplitudeLogEventWithPropertiesAsync,
    amplitudeLogEventWithPropertiesErrorAsync
} from "../../../helper/Amplitude";
import getPushToken from "../../../helper/getPushToken";

const heightStatusBar = getHeightStatusBar();

class RegisterPhoneInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phone: '',
            textLoading: '',

            isLoading: false,
        };
    }

    checkNumberSystem = async () => {
        Keyboard.dismiss();

        const isValidatePhone = await this._validatePhoneNumber();
        const parentRefCode = await this.getParentRefCode();
        const language = await getItemAsync('application_language');
        const notificationsObject = await getPushToken();
        const pushNotificationsEnabled = Boolean(notificationsObject && notificationsObject?.pushToken);
        let eventName = 'user-registration';

        await setItemAsync('parentRefCode', '')

        if (!isValidatePhone) {
            this.setState({isLoading: false});

            DropDownHolder.alert('error', allTranslations(localization.notificationTitleError), allTranslations(localization.registrationErrorsNumberEnteredIncorrectly), 5000, true);

            return null
        }

        this.setState({isLoading: true, textLoading: allTranslations(localization.registrationLoadingsChecksPhone)});

        let phone = this.state.phone.replace(/\D+/g, "");

        const exists = await axios('get', urls["check-login"] + phone).then(res => {
            return res.data.data.exists
        })

        if (exists) {
            this.setState({isLoading: false});

            DropDownHolder.alert('error', allTranslations(localization.notificationTitleError), allTranslations(localization.registrationErrorsNumberRegisteredSystem), 5000, true);

            await amplitudeLogEventWithPropertiesErrorAsync('user-registration', {
                phone: phone,
                message: "Пользователь уже зарегистрирован в системе",
                ...exists
            });

            return null
        }

        this.setState({textLoading: allTranslations(localization.registrationLoadingsSendCodePhoneNumber)});

        let body = {
            phone,
            firstName: "AdWise",
            language: language || 'ru',
            pushNotificationsEnabled
        };
        if (parentRefCode) {
            body.parentRefCode = parentRefCode;
            eventName = 'user-registration-parent';
        }

        axios('post', urls["create-user"], body).then(async (res) => {
            await setItemAsync('verificationId', res.data.data.verificationId);
            await setItemAsync('userId', res.data.data.verificationId);
            await setItemAsync('initJwt', res.data.data.jwt);
            await setItemAsync('startTimerCode', Date.now() + times["countdown-timer"]);

            this.setState({isLoading: false});

            this.props.navigation.navigate('RegisterCodeConfirmation', {
                type: 'phone',
                jwt: res.data.data.jwt,
                phone: this.state.phone
            })

            await amplitudeLogEventWithPropertiesAsync(eventName, {
                ...body,
                ...res.data
            });
        }).catch( async (err) => {
            const errorBody = getError(err.response);
            this.setState({isLoading: false});
            DropDownHolder.alert('error', errorBody.title, errorBody.message, 5000, true);

            await amplitudeLogEventWithPropertiesErrorAsync('user-registration', {
                ...body,
                ...errorBody
            });
        })
    }

    getParentRefCode = async () => {
        const parentRefCode = await getItemAsync('parentRefCode');

        if (!parentRefCode) {
            return null
        }

        const invitation = await axios('get', `${urls["invite-get-ref"]}${parentRefCode}`).then((response) => {
            return response.data.data.ref
        }).catch((error) => {
            return null
        });

        if (!invitation) {
            return null
        }

        return invitation?.code
    }

    _validatePhoneNumber = async () => {
        return await validationPhone(this.state.phone)
    }
    _navigationGoHome = () => {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <Page style={[styles.page, {marginTop: heightStatusBar, paddingVertical: 32}]}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButtonBack} onPress={this._navigationGoHome}>
                        <Icon style={styles.headerButtonBackIcon} name={'arrow-left'} type={'Feather'}/>
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>{ allTranslations(localization.registrationHeaderPhoneNumber) }</Text>
                    <Text style={styles.headerDescription}>{ allTranslations(localization.registrationStageTwoSendConfirmationCode) }</Text>
                </View>

                <ScrollView contentContainerStyle={[commonStyles.container, styles.container]}>
                    <View style={styles.section}>
                        <Icon style={styles.sectionIcon} name={'phone'} type={'Feather'}/>
                        <Text style={styles.sectionText}>{ allTranslations(localization.registrationFormsPhoneNumber) }</Text>
                    </View>
                    <InputPhone
                        value={this.state.phone}
                        onChangeText={(phone) => this.setState({phone})}
                    />
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.buttonNext} onPress={this.checkNumberSystem}>
                        <Text style={styles.buttonNextText}>{ allTranslations(localization.registrationButtonsProceed) }</Text>
                    </TouchableOpacity>
                </View>

                <ModalLoading
                    isOpen={this.state.isLoading}
                    textLoading={this.state.textLoading}
                />
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    container: {
        flex: 1,
        paddingHorizontal: 24
    },

    header: {
        marginBottom: 24,
        position: 'relative'
    },
    headerButtonBack: {
        position: 'absolute',
        left: 0,
        top: 0,

        padding: 16,
        margin: -16,
        marginLeft: 0,

        zIndex: 999
    },
    headerButtonBackIcon: {
        color: '#8152E4',
        fontSize: 32
    },
    headerTitle: {
        fontSize: 30,
        lineHeight: 33,
        fontFamily: 'AtypText_medium',
        textAlign: 'center',

        marginBottom: 16
    },
    headerDescription: {
        fontSize: 18,
        lineHeight: 22,
        fontFamily: 'AtypText',
        textAlign: 'center'
    },

    section: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionIcon: {
        fontSize: 35,
        color: '#ED8E00',
        marginBottom: 18
    },
    sectionText: {
        fontSize: 18,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 16
    },

    buttonNext: {
        paddingVertical: 12,
        paddingHorizontal: 65,

        backgroundColor: '#8152E4',
        borderRadius: 10,

        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonNextText: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: 'white',
        textAlign: 'center'
    },

    footer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default RegisterPhoneInput
