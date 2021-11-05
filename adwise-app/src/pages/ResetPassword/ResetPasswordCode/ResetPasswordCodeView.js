import React, {Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { Text } from 'native-base';
import {
    DropDownHolder, LoginHeader, ModalLoading
} from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import commonStyles from '../../../theme/variables/commonStyles';
import imageBackground from '../../../../assets/graphics/login/bg.png';
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import {ConfirmationField} from "../../Register/RegisterCodeConfirmation/components";
import getError from "../../../helper/getErrors";
import moment from "moment";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import {setItemAsync} from "../../../helper/SecureStore";

const { width, height } = Dimensions.get('window');

class RegisterCodeConfirmation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: '',
            verificationId: '',

            startTimeVerification: 0,
            currentTimeVerification: '',

            code: '',

            error: '',

            openLoading: false,
            isCodeExpired: false
        };

        this.restorationId = this.props.navigation.state.params.restorationId;
        this.onUpdateTimeReset = null;

        this.refTimer = React.createRef();

        this.startTimeReset = Date.now();
    }

    componentDidMount = async () => {
        await this.onUpdateTime();
        this.onUpdateTimeReset = setInterval( async () => {
            await this.onUpdateTime();
        }, 500);
    }
    componentWillUnmount = () => {
        clearInterval(this.onUpdateTimeReset)
    }

    onUpdateTime = async () => {
        const timestamp = 120000 - (Date.now() - this.startTimeReset);
        const momentTime = moment(timestamp).format('mm:ss');
        const isCodeExpired = timestamp <= 0;

        this.refTimer.current.setNativeProps({ text: !isCodeExpired ? momentTime : '' });

        if (isCodeExpired !== this.state.isCodeExpired){
            this.setState({ isCodeExpired })
        }
    }

    onSendCodeAgain = async () => {
        axios('get', `${ urls["send-restoration-code"] }/${ this.restorationId }`).then(async (response) => {
            this.startTimeReset = Date.now();
            await this.onUpdateTime();
        }).catch((error) => {
            this.setState({openLoading: false})
            const errorBody = getError(error.response)
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        });
    }
    onCheckCode = async (code) => {
        this.setState({ code })

        if (code.length === 4){
            await this.confirmRestoration(code)
        }
    }
    confirmRestoration = async (code) => {
        this.setState({ openLoading: true });

        const response = await axios('put', urls["confirm-restoration"] + this.restorationId, {
            code: code
        }).then((response) => {
            return response.data.data;
        }).catch((error) => {
            const errorBody = getError(error.response)
            this.setState({ openLoading: false, code: '' })
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
            return null
        });

        if (!response) {
            return null
        }
        if (response.jwt) {
            await setItemAsync('jwt', response.jwt);

            await this.updateUser();

            return null;
        }

        this.setState({ openLoading: false });
        this.props.navigation.navigate('Login')
    }
    updateUser = async () => {
        const user = await axios('get', urls["get-me"]).then(response => {
            return response.data.data.user;
        }).catch(error => {
            return null;
        })

        if (!user) {
            this.setState({ openLoading: false });
            this.props.navigation.navigate('Login');
        }

        DropDownHolder.modal(
            'success',
            allTranslations(localization.notificationTitleSystemNotification),
            'Пароль успешно изменен. Пожалуйста, измените пароль в разделе "Настройки"'
        );

        this.props.updateAccount(user);
        this.props.navigation.navigate('ChangePassword');
    }

    render() {
        return (
            <View style={styles.page}>
                <Image
                    style={styles.imageBackground}
                    source={imageBackground}
                />

                <LoginHeader
                    title={allTranslations(localization.resetPasswordHomeTitle)}
                    styleTitle={{ textAlign: 'left' }}
                    styleContainerTitle={{ alignItems: 'flex-start' }}
                    isShowButtonBack
                    {...this.props}
                />

                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={false}
                >
                    <View style={[commonStyles.containerBig, styles.container]}>
                        <View style={[styles.section]}>
                            <Text style={[styles.title, {marginBottom: 16, maxWidth: 200}]}>{ allTranslations(localization.resetPasswordVerificationMessage) }</Text>

                            <ConfirmationField
                                value={this.state.code}
                                onChangeText={this.onCheckCode}
                            />

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.textCode}>
                                    { !this.state.isCodeExpired ? allTranslations(localization.registrationStageThreeCodeValidFor) : allTranslations(localization.registrationStageThreeCodeTimedRequestNew) }
                                </Text>
                                <TextInput ref={this.refTimer} style={styles.textCode} value="" editable={false}/>
                            </View>
                        </View>
                        {
                            this.state.error ? (
                                <Text style={styles.errorText}>{ this.state.error }</Text>
                            ) : (<View/>)
                        }
                    </View>

                </KeyboardAwareScrollView>

                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>{allTranslations(localization.resetPasswordVerificationMessageRepeatCode)}</Text>
                    <TouchableOpacity
                        style={[styles.footerButton]}
                        activeOpacity={this.state.isCodeExpired ? 0.2 : 1}
                        onPress={this.state.isCodeExpired ? this.onSendCodeAgain : null}
                    >
                        <Text style={[
                            styles.footerButtonText,
                            !this.state.isCodeExpired && styles.footerButtonTextDisabled
                        ]}>{allTranslations(localization.resetPasswordVerificationButtonRepeatCode)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: 'auto', paddingHorizontal: 42, paddingVertical: 24}}>
                    <TouchableOpacity style={styles.buttonNext} onPress={this.confirmRestoration}>
                        <Text style={styles.buttonNextText}>{ allTranslations(localization.resetPasswordVerificationButtonSendCode) }</Text>
                    </TouchableOpacity>
                </View>

                <ModalLoading
                    isOpen={this.state.openLoading}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },

    imageBackground: {
        minHeight: height,
        minWidth: width,

        position: 'absolute',
        resizeMode: "cover",
        justifyContent: "center"
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },

    headerRoot: {
        marginBottom: 10
    },

    title: {
        textAlign: 'center',
        fontFamily: 'AtypText',
        color: 'black',
        fontSize: 18,
        lineHeight: 20
    },
    input: {
        textAlign: 'center',
        height: 50,
        width: 150,
        fontSize: 22
    },
    inputPlaceholder: {
        fontSize: 18
    },

    buttonTypeRegistration: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        backgroundColor: 'white'
    },
    buttonTypeRegistrationText: {
        lineHeight: 48,
        textAlign: 'center',
        fontFamily: 'AtypText',
        color: 'rgba(0, 0, 0, 0.4)'
    },

    section: {
        width: '100%',
        alignItems: 'center',

        flex: 1,

        justifyContent: 'center'
    },
    sectionIconContainer: {
        width: 35,
        height: 35,
        marginBottom: 26,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionIcon: {
        fontSize: 35,
        width: 35,
        height: 35,
        color: '#ED8E00'
    },

    buttonNext: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#8152E4'
    },
    buttonNextText: {
        lineHeight: 48,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'AtypText_medium'
    },

    errorText: {
        fontSize: 12,
        marginTop: 2,
        color: '#F35647'
    },

    textCode: {
        fontSize: 14,
        lineHeight: 20,

        color: 'black',
        opacity: 0.5,

        textAlign: 'center',
        marginTop: 16
    },

    footer: {
        paddingTop: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerTitle: {
        fontSize: 14,
        lineHeight: 16,
        fontFamily: 'AtypText'
    },
    footerButton: {
        paddingVertical: 8,
        paddingHorizontal: 24
    },
    footerButtonText: {
        fontSize: 14,
        lineHeight: 16,
        fontFamily: 'AtypText',

        color: '#ED8E00'
    },
    footerButtonTextDisabled: {
        color: '#000000',
        opacity: 0.5
    }
})

export default RegisterCodeConfirmation
