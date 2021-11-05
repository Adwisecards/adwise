import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform
} from 'react-native';
import {
    Text,
    Icon
} from 'native-base';
import {
    Page,
    ModalLoading, DropDownHolder
} from '../../../components/index';
import {
    ConfirmationField
} from './components';
import commonStyles from '../../../theme/variables/commonStyles';
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import {deleteItemAsync, getItemAsync, setItemAsync} from "../../../helper/SecureStore";
import getError from "../../../helper/getErrors";
import moment from "moment";
import getHeightStatusBar from "../../../helper/getHeightStatusBar";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

const heightStatusBar = getHeightStatusBar();

class RegisterCodeConfirmation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            code: '',

            timeWorkCode: null,

            isLoading: false,
            isSendCodeAgain: true,
            isShowFillingQuestion: false
        };

        this.phone = (this.props.navigation.state.params) ? this.props.navigation.state.params.phone : 'Ваш номер';
        this.email = (this.props.navigation.state.params) ? this.props.navigation.state.params.email : 'Ваш email';
        this.isPhone = (this.props.navigation.state.params) ? this.props.navigation.state.params.type === 'phone' : 'false';
        this.jwt = (this.props.navigation.state.params) ? this.props.navigation.state.jwt : null;

        this.updateTime = null;
        this.refTimer = React.createRef();
        this.startTimeReset = Date.now();
    }

    componentDidMount = async () => {
        if (!this.jwt) {
            this.jwt = await getItemAsync('initJwt');
        }

        await this.onTimerUpdate();
        this.updateTime = setInterval(async () => {
            await this.onTimerUpdate();
        }, 1000)
    }
    componentWillUnmount = () => {
        clearInterval(this.updateTime)
    }

    onCheckCode = async (code) => {
        this.setState({code})

        if (code.length === 4) {
            await this.onVerification(code)
        }
    }
    onVerification = async (code) => {
        this.setState({isLoading: true});

        let verificationId = await getItemAsync('verificationId');

        let url = urls["delete-verification"] + '' + verificationId + '?code=' + code;

        const response = await axios('delete', url).then(response => {
            return response.data.data
        }).catch(error => {
            const errorBody = getError(error.response)
            this.setState({isLoading: false, code: ''})
            DropDownHolder.alert('error', errorBody.title, errorBody.message, 5000, true);

            clearInterval(this.updateTime)

            return null
        })

        if (!response) {
            return null
        }

        this.setState({ isLoading: false});

        await this.onSkipFillingData();

        await deleteItemAsync('verificationId');
        clearInterval(this.updateTime);

        await setItemAsync('isEndRegistration', true);
    }
    onSkipFillingData = async () => {
        this.setState({isShowFillingQuestion: false});
        await this.getAccount();
    }

    getAccount = async () => {
        await setItemAsync('jwt', this.jwt);

        axios('get', `${urls["get-me"]}?platform=${Platform.OS}`).then((response) => {
            this.props.updateAccount(response.data.data.user)
        })
    }

    onTimerUpdate = async () => {
        const timestamp = 120000 - (Date.now() - this.startTimeReset);
        const momentTime = moment(timestamp).format('mm:ss');
        const isSendCodeAgain = timestamp <= 0;

        this.refTimer.current.setNativeProps({text: !isSendCodeAgain ? momentTime : ''});

        if (isSendCodeAgain !== this.state.isSendCodeAgain) {
            this.setState({isCodeExpired})
        }
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

                    <Text
                        style={styles.headerTitle}>{allTranslations(localization.registrationHeaderEnterCodeSms)}</Text>
                    <Text
                        style={styles.headerDescription}>{allTranslations(localization.registrationStageThreeSentTo, {phone: this.phone})}</Text>
                </View>

                <ScrollView contentContainerStyle={[commonStyles.container, styles.container]}>
                    <ConfirmationField
                        value={this.state.code}
                        onChangeText={this.onCheckCode}
                    />
                </ScrollView>

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

    // header: {
    //     marginBottom: 42
    // },
    // headerTitle: {
    //     fontSize: 30,
    //     lineHeight: 33,
    //     fontFamily: 'AtypText_medium',
    //     textAlign: 'center',
    //
    //     marginBottom: 16
    // },
    // headerDescription: {
    //     fontSize: 18,
    //     lineHeight: 22,
    //     fontFamily: 'AtypText',
    //     textAlign: 'center'
    // },

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
