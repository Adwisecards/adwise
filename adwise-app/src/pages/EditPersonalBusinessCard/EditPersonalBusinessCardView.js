import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native';
import {
    Page,
    Input,
    LoginHeader,
    ModalLoading,
    HeaderControlsButtons, DropDownHolder
} from '../../components';
import {
    ButtonEdit,
    FormCommonData,
    ChoosingCardColor,
    FormContactDetails,
    FormSocialNetworks
} from './components';
import commonStyles from "../../theme/variables/commonStyles";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import {formatPhoneNumber} from "../../helper/format";
import getError from "../../helper/getErrors";
import getHeightStatusBar from "../../helper/getHeightStatusBar";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const heightStatusBar = getHeightStatusBar();

class EditPersonalBusinessCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: this.props.navigation.state.params.id,

            initialForm: {},

            contactInformation: {},

            fullFileSend: null,

            isLoadingPage: true,
            isLoadingSubmit: false
        }

        this.refFormCommonData = React.createRef();
        this.refFormContactDetails = React.createRef();
        this.refFormSocialNetworks = React.createRef();
    }

    componentDidMount = async () => {
        await this.getInitialForm();
    }

    getInitialForm = async () => {
        const dataContact = await axios('get', urls["get-contact"] + this.state.userId).then(response => { return response.data.data.contact });

        let initialForm = {
            firstName: dataContact.firstName.value,
            lastName: dataContact.lastName.value,
            phone: formatPhoneNumber(dataContact.phone.value),
            email: dataContact.email.value,
            description: dataContact.description.value,
            activity: dataContact.activity.value,
            website: dataContact.website.value,

            picture: dataContact.picture.value,

            insta: (dataContact.socialNetworks.insta.value) ? dataContact.socialNetworks.insta.value.replace('https://www.instagram.com/', ''): '',
            fb: (dataContact.socialNetworks.fb.value) ? dataContact.socialNetworks.fb.value.replace('https://www.facebook.com/', '') : '',
            vk: (dataContact.socialNetworks.vk.value) ? dataContact.socialNetworks.vk.value.replace('https://vk.com/', '') : '',

            color: dataContact.color
        };

        this.setState({
            initialForm,
            contactInformation: dataContact,
            isLoadingPage: false
        })
    }

    onChangeInitialForm = (initialForm) => {
        this.refFormCommonData.current.setValues(initialForm);
        this.refFormContactDetails.current.setValues(initialForm);
        // this.refFormSocialNetworks.current.setValues(initialForm);

        this.setState({ initialForm })
    }
    onChangeFormField = (name, value) => {
        let initialForm = {...this.state.initialForm};

        initialForm[name] = value;

        this.setState({ initialForm })
    }

    onCheckValidationForm = async () => {
        const validateFormCommonData = Object.keys(await this.refFormCommonData.current.validateForm()).length === 0;
        const validateFormContactDetails = Object.keys(await this.refFormContactDetails.current.validateForm()).length === 0;
        // const validateFormSocialNetworks = Object.keys(await this.refFormSocialNetworks.current.validateForm()).length === 0;

        if (!validateFormCommonData){
            await this.refFormCommonData.current.submitForm()
        }
        if (!validateFormContactDetails){
            await this.refFormContactDetails.current.submitForm()
        }
        // if (!validateFormSocialNetworks){
        //     await this.refFormSocialNetworks.current.submitForm()
        // }

        if (validateFormCommonData && validateFormContactDetails){
            this.setState({ isLoadingSubmit: true })

            await this.onUpdateData()
        }
    }
    onUpdateData = async () => {
        let body = await this.getFormData();

        axios('put', urls["update-contact"] + this.state.userId, body).then((response) => {
            this.setState({
                isLoadingSubmit: false
            }, async () => {
                this.props.navigation.goBack();
                this.updateAccount()
            })

            DropDownHolder.alert('success',
                allTranslations(localization.editPersonalBusinessCardNotificationsUpdateTitle),
                allTranslations(localization.editPersonalBusinessCardNotificationsUpdateMessage)
            )
        }).catch(error => {
            const errorBody = getError(error.response)
            this.setState({ isLoadingSubmit: false })
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        })
    }
    getFormData = async () => {
        let body = new FormData();
        let initialForm = {...this.state.initialForm};

        for(let key in initialForm){
            let value = initialForm[key];

            if (value){
                if (key === 'picture'){
                    if (this.state.fullFileSend){
                        const splitUri = {...this.state.fullFileSend}.uri.split('.');

                        body.append('picture', {
                            uri : this.state.fullFileSend.uri,
                            name: 'image.' + splitUri[splitUri.length - 1],
                            type: 'image/' + splitUri[splitUri.length - 1]
                        })
                    }
                }
                if (key === 'phone'){
                    if (initialForm.phone){
                        body.append('phone', initialForm.phone.replace(/\D+/g,""))
                    }
                }
                if (key === 'vk'){
                    if (initialForm.vk) {
                        body.append(key, `https://vk.com/${ initialForm.vk }`);
                    }else{
                        body.append(key, '');
                    }
                }
                if (key === 'insta'){
                    if (initialForm.insta) {
                        body.append(key, `https://www.instagram.com/${ initialForm.insta }`);
                    } else {
                        body.append(key, '');
                    }
                }
                if (key === 'fb'){
                    if (initialForm.fb) {
                        body.append(key, `https://www.facebook.com/${ initialForm.fb }`);
                    } else{
                        body.append(key, '');
                    }
                }

                if (
                    key !== 'picture' &&
                    key !== 'phone' &&
                    key !== 'vk' &&
                    key !== 'insta' &&
                    key !== 'fb'
                ) {
                    body.append(key, value);
                }
            }
        }

        return body
    }
    updateAccount = () => {
        axios('get', urls["get-me"]).then(response => {
            this.props.updateAccount(response.data.data.user)
        })
    }

    render() {
        if (this.state.isLoadingPage){
            return (
                <Page style={[styles.page, {paddingTop: heightStatusBar}]}>
                    <ScrollView
                        contentContainerStyle={[commonStyles.container, { paddingBottom: 40 }]}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <HeaderControlsButtons
                            styleContainer={{ marginBottom: 24 }}
                            { ...this.props }
                        />

                        <LoginHeader
                            title={allTranslations(localization.editPersonalBusinessCardTitle)}
                            styleRoot={styles.headerRoot}
                            styleTitle={styles.headerTitle}
                            styleContainerTitle={{ alignItems: 'flex-start' }}
                            isShowButtonBack

                            { ...this.props }
                        />

                        <Text>Loading</Text>

                    </ScrollView>
                </Page>
            )
        }

        return (
            <Page style={[styles.page, {paddingTop: heightStatusBar}]}>
                <ScrollView
                    contentContainerStyle={[commonStyles.container, { paddingBottom: 40 }]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <HeaderControlsButtons
                        styleContainer={{ marginBottom: 24 }}
                        { ...this.props }
                    />

                    <LoginHeader
                        title={allTranslations(localization.editPersonalBusinessCardTitle)}
                        styleRoot={styles.headerRoot}
                        styleTitle={styles.headerTitle}
                        styleContainerTitle={{ alignItems: 'flex-start' }}
                        isShowButtonBack

                        { ...this.props }
                    />

                    <View style={[styles.section]}>
                        <View style={styles.section_Header}>
                            <Text style={styles.section_Title}>{allTranslations(localization.editPersonalBusinessCardCommonData)}</Text>
                        </View>

                        <FormCommonData
                            setRef={this.refFormCommonData}
                            initialForm={this.state.initialForm}
                            onChangeInitialForm={this.onChangeInitialForm}
                        />
                    </View>

                    <View style={[styles.section]}>
                        <View style={styles.section_Header}>
                            <Text style={styles.section_Title}>{allTranslations(localization.editPersonalBusinessCardContactDetails)}</Text>
                        </View>

                        <FormContactDetails
                            setRef={this.refFormContactDetails}
                            initialForm={this.state.initialForm}
                            onChangeInitialForm={this.onChangeInitialForm}
                        />
                    </View>

                    <View style={[styles.section]}>
                        <View style={styles.section_Header}>
                            <Text style={styles.section_Title}>{allTranslations(localization.editPersonalBusinessCardSocialNetworks)}</Text>
                        </View>

                        <FormSocialNetworks
                            setRef={this.refFormSocialNetworks}
                            initialForm={this.state.initialForm}
                            onChangeInitialForm={this.onChangeInitialForm}
                        />
                    </View>

                    <View style={[styles.section]}>
                        <View style={styles.section_Header}>
                            <Text style={styles.section_Title}>{allTranslations(localization.editPersonalBusinessCardPersonalInformation)}</Text>
                        </View>

                        <Input
                            value={this.state.initialForm.description}
                            multiline
                            placeholder={allTranslations(localization.editPersonalBusinessCardPersonalInformationMessage)}
                            numberOfLines={1}
                            styleInput={{ lineHeight: 25, alignItems: 'baseline' }}
                            onChangeText={(value) => this.onChangeFormField('description', value)}
                        />
                    </View>


                    <View style={[styles.section]}>
                        <View style={styles.section_Header}>
                            <Text style={styles.section_Title}>{allTranslations(allTranslations(localization.editPersonalBusinessCardBusinessCardColors))}</Text>
                        </View>

                        <ChoosingCardColor
                            contactInformation={this.state.contactInformation}
                            initialForm={this.state.initialForm}
                            onChangeInitialForm={this.onChangeInitialForm}
                        />
                    </View>

                </ScrollView>

                <ButtonEdit
                    onPress={this.onCheckValidationForm}
                />

                <ModalLoading
                    isOpen={this.state.isLoadingSubmit}
                />
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    headerRoot: {
        paddingHorizontal: 0,
        marginBottom: 16,
        marginTop: 0
    },

    controlContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',

        marginBottom: 24,
        marginLeft: -12,
    },

    borderContainer: {
        backgroundColor: 'white',
        borderRadius: 10
    },

    section: {
        marginBottom: 40
    },
    section_Header: {
        marginBottom: 20
    },
    section_Title: {
        fontFamily: 'AtypText_semibold',
        fontSize: 20,
        lineHeight: 22,
        color: 'black',
    },

    buttonOutline: {
        width: '100%',
        height: 33,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#9671e6',
        borderRadius: 8
    },
    buttonOutlineText: {
        color: '#8152E4',
        fontFamily: 'AtypText_semibold',
        fontSize: 14,
        lineHeight: 30,
        textTransform: 'uppercase',
        textAlign: 'center',
    },

    headerTitle: {
        fontSize: 24,
        lineHeight: 26,
        textAlign: 'left'
    },
})

export default EditPersonalBusinessCard
