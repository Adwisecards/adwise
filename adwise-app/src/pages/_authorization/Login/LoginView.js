import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView
} from 'react-native';
import {
    LoginHeader, ModalLoading, Page
} from '../../../components';
import { Form } from './components';
import commonStyles from '../../../theme/variables/commonStyles';
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import {getItemAsync, setItemAsync} from "../../../helper/SecureStore";
import getPushToken from "../../../helper/getPushToken";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import {logEvent} from "../../../helper/Analytics";
import {
    amplitudeLogEventWithPropertiesAsync,
    amplitudeLogEventWithPropertiesErrorAsync
} from "../../../helper/Amplitude";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                login: '',
                password: ''
            },

            openLoading: false
        }
    }

    signIn = async (form, {setErrors}) => {
        this.setState({openLoading: true});

        const formSending = await this.getFormSing(form);

        const response = await axios('post', urls["sign-in"], formSending).then(response => {
            return {
                status: 'success',
                data: response.data.data
            }
        }).catch(error => {
            console.log('error: ', error.response)

            return {
                status: 'error',
                data: error.response.data
            }
        })

        if (response.status === 'error') {
            await setErrors({
                password: allTranslations(localization.authorizationErrorsWrongLoginPassword)
            })
            this.setState({openLoading: false});

            await amplitudeLogEventWithPropertiesErrorAsync('user-authorization', {
                ...formSending,
                ...response.data
            });

            return null
        }

        await setItemAsync('jwt', response.data.jwt);

        await this.getMe(response.data.jwt);

        await amplitudeLogEventWithPropertiesAsync('user-authorization', {
            ...formSending,
            ...response.data
        });
    }
    getFormSing = async (form) => {
        const notificationsObject = await getPushToken();
        const language = await getItemAsync('application_language');
        const pushNotificationsEnabled = Boolean(notificationsObject && notificationsObject?.pushToken);

        let body = {
            ...form,
            language: language || 'ru',
            pushNotificationsEnabled
        };
        body.login = body.login.replace(/\D+/g, "");

        if (!!notificationsObject){
            body['pushToken'] = notificationsObject.pushToken;
            body['deviceToken'] = notificationsObject.deviceToken;
        }


        return body;
    }

    getMe = async () => {
        const response = await axios('get', urls["get-me"]).then(response => {
            return {
                status: 'success',
                data: response.data.data
            }
        }).catch(error => {
            return {
                status: 'error',
                data: error.response.data
            }
        })

        if (response.status === 'error') {
            this.setState({openLoading: false});

            return null
        }

        this.props.updateAccount(response.data.user);
        this.setState({openLoading: false});
    }


    render() {
        return (
            <Page style={styles.page}>
                <LoginHeader
                    title={allTranslations(localization.authorizationHeaderEntry)}
                    linkGoBack={'StartScreen'}
                    isShowButtonBack
                    {...this.props}
                />
                <ScrollView
                    style={{flex: 1}}
                    contentContainerStyle={[commonStyles.containerBig, styles.container]}
                >
                    <Form
                        form={this.state.form}
                        onSubmit={this.signIn}
                        {...this.props}
                    />

                </ScrollView>

                <ModalLoading
                    isOpen={this.state.openLoading}
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
        justifyContent: 'center'
    },

    controlContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1
    },
    controlButton: {
        width: 55,
        height: 55,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,
        backgroundColor: 'white'
    },
    controlButtonIcon: {
        flex: 1,
        maxWidth: 40
    },
    itemForm: {
        alignItems: 'center'
    },
    title: {
        textAlign: 'center',
        fontFamily: 'AtypText',
        color: 'black',
        fontSize: 18,
        lineHeight: 22,
        marginBottom: 16
    },
    input: {
        textAlign: 'center'
    },
})

export default Login
