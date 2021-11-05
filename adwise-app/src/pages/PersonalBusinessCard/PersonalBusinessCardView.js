import React, {Component} from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity, Platform, Image
} from "react-native";
import {
    Page,
    ModalLoading,
    HeaderAccounts,
    DropDownHolder
} from "../../components";
import {
    Input,
    ChoosingCardColor
} from "./components";
import {Formik} from "formik";
import * as Yup from "yup";
import {withNextInputAutoFocusForm} from "react-native-formik";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import {formatPhoneNumber} from "../../helper/format";
import getError from "../../helper/getErrors";
import * as Linking from "expo-linking";
import imageButtonWallet from "../../../assets/graphics/wallet/wallet_button.png";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const FormView = withNextInputAutoFocusForm(View);

class PersonalBusinessCard extends Component {
    constructor(props) {
        super(props);

        const params = this.props.navigation.state.params;

        this.state = {
            contact: {},
            response: {},

            isLoading: true,
            isError: false,
            isShowModalLoading: false
        };

        this.isIos = Platform.OS === 'ios';
        this.contactId = params.id;
        this.refForm = React.createRef();
    }

    componentDidMount = async () => {
        await this.getContact();
    }

    getContact = async () => {
        const response = await axios('get', `${urls["get-contact"]}${this.contactId}`).then(response => { return response.data.data.contact });

        let contact = {
            firstName: response?.firstName?.value || '',
            lastName: response?.lastName?.value || '',
            phone: formatPhoneNumber(response?.phone?.value || ''),
            email: response?.email?.value || '',
            description: response?.description?.value || '',
            activity: response?.activity?.value || '',
            website: response?.website?.value || '',

            picture: response?.picture?.value || '',

            insta: (response?.socialNetworks?.insta?.value) ? response.socialNetworks.insta.value.replace('https://www.instagram.com/', ''): '',
            fb: (response?.socialNetworks?.fb?.value) ? response.socialNetworks.fb.value.replace('https://www.facebook.com/', '') : '',
            vk: (response?.socialNetworks?.vk?.value) ? response.socialNetworks.vk.value.replace('https://vk.com/', '') : '',

            color: response.color
        };

        this.setState({
            contact,
            response: response,
            isLoading: false
        }, () => {
            this.refForm.current.setValues(contact);
        })
    }

    onSave = async () => {
        this.setState({ isShowModalLoading: true });

        const body = await this.getBody();

        const response = axios('put', `${urls["update-contact"]}${ this.contactId }`, body).then((response) => {
            return true
        }).catch(error => {
            const errorBody = getError(error.response)
            DropDownHolder.alert('error', errorBody.title, errorBody.message);

            return null
        });

        if (!response) {
            this.setState({ isShowModalLoading: false })

            return null
        }

        this.updateAccount();
    }
    getBody = async () => {
        let body = new FormData();
        let initialForm = {...this.state.contact};

        for(let key in initialForm){
            let value = initialForm[key];

            if (value){
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
            DropDownHolder.alert(
                'success',
                allTranslations(localization.notificationTitleSystemNotification),
                allTranslations(localization.editPersonalBusinessCardNotificationsUpdateMessage)
            );
            this.props.updateAccount(response.data.data.user)
            this.setState({ isShowModalLoading: false })
            this.props.navigation.goBack();
        })
    }

    onChangeInput = (event) => {
        const { name, value } = event;

        let contact = {...this.state.contact};
        contact[name] = value;

        this.setState({ contact });
        this.refForm.current.setValues(contact);
    }

    _routePageWallet = () => {
        Linking.openURL(`${ urls["prod-host"] }${ urls["wallet-contact-pass"] }${ this.state.response._id }`);
    }

    render() {
        const {contact, response, isShowModalLoading} = this.state;
        const isIos = this.isIos;

        if (Object.keys(contact).length <= 0) {
            return (
                <Page style={styles.page}>
                    <HeaderAccounts title={allTranslations(localization.personalBusinessCardTitle)} {...this.props}/>
                </Page>
            )
        }

        return (
            <Page style={styles.page}>

                <HeaderAccounts title={allTranslations(localization.personalBusinessCardTitle)} {...this.props}/>

                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                >

                    <Formik
                        innerRef={this.refForm}
                        initialValues={contact}
                        validationSchema={validationSchemes}

                        onSubmit={this.onSave}
                    >
                        {(props) => {
                            const {values, errors, touched, handleSubmit} = props;
                            return (
                                <FormView>
                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>{allTranslations(localization.editPersonalBusinessCardCommonData)}</Text>

                                        <Text style={[styles.formTitle, { marginBottom: 32 }]}>
                                            {allTranslations(localization.editPersonalBusinessCardCommonDataMessage)}
                                        </Text>

                                        <View>
                                            <Text style={[styles.formTitle]}>{allTranslations(localization.editPersonalBusinessCardFormsActivityTitle)}</Text>
                                            <Input
                                                error={Boolean(touched['activity'] && errors['activity'])}
                                                helperText={touched['activity'] && errors['activity']}

                                                name="activity"
                                                value={values.activity}
                                                placeholder={allTranslations(localization.editPersonalBusinessCardFormsActivityPlaceholder)}

                                                onChange={this.onChangeInput}
                                            />
                                        </View>

                                    </View>

                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>{allTranslations(localization.editPersonalBusinessCardContactDetails)}</Text>

                                        <View style={{ marginBottom: 24 }}>
                                            <Text style={[styles.formTitle]}>{allTranslations(localization.editPersonalBusinessCardFormsPhoneTitle)}</Text>
                                            <Input
                                                error={Boolean(touched['phone'] && errors['phone'])}
                                                helperText={touched['phone'] && errors['phone']}

                                                name="phone"
                                                value={values.phone}
                                                placeholder={allTranslations(localization.editPersonalBusinessCardFormsPhonePlaceholder)}

                                                useMask
                                                type="custom"
                                                options={{
                                                    mask: '+7 999 999-99-99'
                                                }}

                                                autoCapitalize='none'
                                                keyboardType='phone-pad'

                                                onChange={this.onChangeInput}
                                            />
                                        </View>
                                        <View style={{ marginBottom: 24 }}>
                                            <Text style={[styles.formTitle]}>Email</Text>
                                            <Input
                                                error={Boolean(touched['email'] && errors['email'])}
                                                helperText={touched['email'] && errors['email']}

                                                name="email"
                                                value={values.email}
                                                placeholder="info@adwise.cards"

                                                autoCapitalize='none'

                                                onChange={this.onChangeInput}
                                            />
                                        </View>
                                        <View>
                                            <Text style={[styles.formTitle]}>{allTranslations(localization.editPersonalBusinessCardFormsWebsiteTitle)}</Text>
                                            <Input
                                                error={Boolean(touched['website'] && errors['website'])}
                                                helperText={touched['website'] && errors['website']}

                                                name="website"
                                                value={values.website}
                                                placeholder={allTranslations(localization.editPersonalBusinessCardFormsWebsitePlaceholder)}

                                                autoCapitalize='none'

                                                onChange={this.onChangeInput}
                                            />
                                        </View>

                                    </View>

                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>{allTranslations(localization.editPersonalBusinessCardSocialNetworks)}</Text>

                                        <View style={{ marginBottom: 24 }}>
                                            <Text style={[styles.formTitle]}>VK</Text>
                                            <Input
                                                error={Boolean(touched['vk'] && errors['vk'])}
                                                helperText={touched['vk'] && errors['vk']}

                                                name="vk"
                                                value={values.vk}
                                                placeholder="adwise.cards"

                                                autoCapitalize='none'
                                                leftContent={() => (
                                                    <Text style={styles.inputSocialDomen}>vk.com/</Text>
                                                )}

                                                onChange={this.onChangeInput}
                                            />
                                        </View>
                                        <View style={{ marginBottom: 24 }}>
                                            <Text style={[styles.formTitle]}>Instagram</Text>
                                            <Input
                                                error={Boolean(touched['insta'] && errors['insta'])}
                                                helperText={touched['insta'] && errors['insta']}

                                                name="insta"
                                                value={values.insta}
                                                placeholder="adwise.cards"

                                                autoCapitalize='none'
                                                leftContent={() => (
                                                    <Text style={styles.inputSocialDomen}>instagram.com/</Text>
                                                )}

                                                onChange={this.onChangeInput}
                                            />
                                        </View>
                                        <View>
                                            <Text style={[styles.formTitle]}>Facebook</Text>
                                            <Input
                                                error={Boolean(touched['fb'] && errors['fb'])}
                                                helperText={touched['fb'] && errors['fb']}
                                                name="fb"
                                                value={values.fb}
                                                placeholder="adwise.cards"

                                                autoCapitalize='none'
                                                leftContent={() => (
                                                    <Text style={styles.inputSocialDomen}>fb.com/</Text>
                                                )}

                                                onChange={this.onChangeInput}
                                            />
                                        </View>

                                    </View>

                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>{allTranslations(localization.editPersonalBusinessCardPersonalInformation)}</Text>

                                        <Input
                                            error={Boolean(touched['description'] && errors['description'])}
                                            helperText={touched['description'] && errors['description']}

                                            multiline
                                            textAlignVertical="top"
                                            numberOfLines={4}

                                            root={{ minHeight: 50, height: 'auto' }}
                                            style={{ paddingVertical: 8 }}

                                            name="description"
                                            value={values.description}
                                            placeholder={allTranslations(localization.editPersonalBusinessCardPersonalInformationMessage)}

                                            onChange={this.onChangeInput}
                                        />

                                    </View>

                                    <View style={[styles.section, { marginBottom: 24 }]}>
                                        <Text style={styles.sectionTitle}>{allTranslations(localization.editPersonalBusinessCardBusinessCardColors)}</Text>

                                        <ChoosingCardColor
                                            contact={contact}
                                            response={response}
                                            name="color"
                                            onChange={this.onChangeInput}
                                        />

                                    </View>

                                    <View>
                                        <TouchableOpacity style={styles.buttonSave} onPress={handleSubmit}>
                                            <Text style={styles.buttonSaveText}>{allTranslations(localization.editPersonalBusinessCardColorsPickerButtonSave)}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </FormView>
                            )
                        }}

                    </Formik>

                </ScrollView>

                {
                    isIos && (
                        <TouchableOpacity
                            style={styles.buttonWallet}
                            onPress={this._routePageWallet}
                        >
                            <Image
                                style={{ flex: 1, width: 110 }}
                                source={imageButtonWallet}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    )
                }

                <ModalLoading
                    isOpen={isShowModalLoading}
                />

            </Page>
        )
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    container: {
        padding: 12
    },

    section: {
        marginBottom: 40
    },
    sectionTitle: {
        fontFamily: "AtypText_medium",
        fontSize: 20,
        lineHeight: 22,
        color: 'black',

        marginBottom: 20
    },

    formTitle: {
        marginBottom: 8,

        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 18,
        color: 'black',
        opacity: 0.6,
    },

    buttonWallet: {
        position: 'absolute',
        left: 12,
        bottom: 8,

        width: 110,
        height: 38,
    },

    inputSocialDomen: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 48,
        letterSpacing: 1,
        marginRight: 2,
        opacity: 0.5
    },

    buttonSave: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#8152E4',

        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 40
    },
    buttonSaveText: {
        fontFamily: "AtypText_medium",
        fontSize: 20,
        lineHeight: 22,
        color: 'white',
    }
});

const validationSchemes = Yup.object().shape({
    email: Yup.string().email(allTranslations(localization.yupEmail)),
    phone: Yup.string().matches('^\\+7 \\d{3} \\d{3}-\\d{2}-\\d{2}', allTranslations(localization.yupPhone)),
    website: Yup.string().matches(/^[-а-я-А-Я-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z-а-я]{2,6}\b([-а-я-А-Я-a-zA-Z0-9@:%_\+.~#?&//=]*)/i, allTranslations(localization.yupRegexpUrl))
});

export default PersonalBusinessCard
