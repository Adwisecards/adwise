import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Platform,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';
import {
    Page,
    Input,
    LoginHeader,
    ModalLoading,
    DropDownHolder,
    InputPhone
} from "../../../components";
import {Icon} from "native-base";
import i18n from "i18n-js";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import getError from "../../../helper/getErrors";
import localization from "../../../localization/localization";
import allTranslations from "../../../localization/allTranslations";
import {
    amplitudeLogEventWithPropertiesAsync,
    amplitudeLogEventWithPropertiesErrorAsync
} from "../../../helper/Amplitude";


class ResetPasswordPhone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phone: '',

            isLoading: false
        }
    }

    componentDidMount = () => {
    }

    onReset = async () => {
        const {navigate} = this.props.navigation;
        const isValidate = this.state.phone.replace(/\D+/g, "").length === 11;

        if (!isValidate) {
            return null
        }

        this.setState({isLoading: true});

        await axios('post', urls["create-restoration"], {
            phone: this.state.phone.replace(/\D+/g, "")
        }).then( async (response) => {
            await amplitudeLogEventWithPropertiesAsync('user-password-reset', {
                phone: this.state.phone,
                ...response.data.data
            });

            this.setState({isLoading: false})

            navigate('ResetPasswordCode', {
                restorationId: response.data.data.restorationId
            });
        }).catch(async (error) => {
            this.setState({isLoading: false})
            const errorBody = getError(error.response)
            DropDownHolder.alert('error', errorBody.title, errorBody.message);

            await amplitudeLogEventWithPropertiesErrorAsync('user-password-reset', {
                ...errorBody
            });
        })
    }

    render() {
        const isValidate = this.state.phone.replace(/\D+/g, "").length === 11;

        return (
            <Page style={styles.page}>
                <LoginHeader
                    title={allTranslations(localization.resetPasswordHomeTitle)}
                    styleTitle={{textAlign: 'left'}}
                    styleContainerTitle={{alignItems: 'flex-start'}}
                    isShowButtonBack
                    {...this.props}
                />

                <ScrollView
                    style={{flex: 1}}
                    contentContainerStyle={styles.scrollView}
                >
                    <View style={styles.content}>
                        <View style={styles.pageReset_ContainerIcon}>
                            <Icon style={styles.pageReset_Icon} name={'phone'} type={'Feather'}/>
                        </View>

                        <Text style={styles.pageReset_Title}>{allTranslations(localization.resetPasswordPhoneMessage)}</Text>

                        <InputPhone
                            name={'login'}
                            value={this.state.phone}
                            onChangeText={(phone) => this.setState({phone})}
                        />
                    </View>
                </ScrollView>

                <View style={styles.contentFooter}>
                    <TouchableOpacity
                        style={[styles.pageReset_Button, !isValidate && styles.pageReset_ButtonDisabled]}
                        disabled={!isValidate}

                        onPress={this.onReset}
                    >
                        <Text style={[styles.pageReset_ButtonText, !isValidate && styles.pageReset_ButtonTextDisabled]}>
                            {allTranslations(localization.resetPasswordPhoneButtonRequest)}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ModalLoading
                    isOpen={this.state.isLoading}
                    textLoading={allTranslations(localization.resetPasswordPhoneDialogMessage)}
                />
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    scrollView: {
        flex: 1,
        justifyContent: 'center'
    },

    content: {
        flex: 1,
        padding: 44,
        justifyContent: 'center'
    },
    contentFooter: {
        paddingHorizontal: 44,
        paddingBottom: 44
    },

    pageReset_ContainerIcon: {
        alignItems: 'center',
        justifyContent: 'center',

        marginBottom: 18
    },
    pageReset_Icon: {
        fontSize: 35,
        color: '#ED8E00'
    },

    pageReset_Title: {
        marginBottom: 16,

        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 22,
        textAlign: 'center'
    },

    pageReset_Input: {
        paddingVertical: 12,
        fontSize: 18,
        lineHeight: 20,
        width: '100%'
    },

    pageReset_Button: {
        width: '100%',
        borderRadius: 10,
        paddingVertical: 16,
        backgroundColor: '#8152E4'
    },
    pageReset_ButtonDisabled: {
        backgroundColor: '#959595'
    },
    pageReset_ButtonText: {
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 20,
        color: 'white',
        fontFamily: 'AtypText'
    },
    pageReset_ButtonTextDisabled: {
        opacity: 0.6
    }
})

export default ResetPasswordPhone
