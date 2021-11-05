import React, {Component} from 'react';
import {
    Box,
    Grid,
    Button,
    Link,
    Backdrop,
    CircularProgress,
    Typography,
    Tabs,
    Tab,
    Badge,
    Switch
} from '@material-ui/core';
import {
    withStyles
} from "@material-ui/styles";
import {
    DialogAddress,
    ReferralSystem,
    MessageChangeRequest,
    MobileCardOrganization
} from './components';
import {
    FormMain,
    FormMobile,
    FormSocials,
    FormSecondary,
    FormRequisites,
    FormOrganizationBankDetails,
    FormOrganizationCreditCardLink
} from './forms';
import {
    Copy as CopyIcon,
} from '../../../icons';
import {
    ColorPicker,
    StagesDocumentVerification
} from '../../../components';
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import queryString from "query-string";
import getErrorMessage from "../../../helper/getErrorMessage";
// import getBodyOoo from "../../../legalForms/helpers/getBodyOoo";
// import getBodyIp from "../../../legalForms/helpers/getBodyIp";
// import getBodyIndividual from "../../../legalForms/helpers/getBodyIndividual";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import alertNotification from "../../../common/alertNotification";
import {getAddressId, getIsAddressValid, isAddressValid} from "../../../common/address";
import {fileOctetStreamToPng, getMediaId, getMediaUrl} from "../../../common/media";
import {

    getBodyFromForm,
    getFormFromBody

} from "../../../legalForms/helpers";
import {getLegalOrganization, setLegalOrganization} from "../../../common/organizationLegal";

class OrganizationAbout extends Component {
    constructor(props) {
        super(props);

        const searchString = this.props.history.location.search;
        const searchParams = queryString.parse(searchString);
        const activeTab = searchParams?.tab || "about";

        this.state = {
            organization: this.props.organization,
            organizationDocuments: {},

            activeTab: `organization-${activeTab}`,
            wiseWinPacket: "",

            errorTabs: [false, false],
            countryLegalForms: [],
            packets: [],

            picture: null,
            mainPicture: null,

            isSubmittingForm: false,
            isOpenDialogAddress: false,
            isActiveBankDetails: false,
            isCreateLegalInfoRequest: false,
            isOpenMessageChangeRequest: false
        }

        this.organizationId = this.props.organization._id;
        this.refFormMain = React.createRef();
        this.refFormMobile = React.createRef();
        this.refFormSecondary = React.createRef();
        this.refFormOrganizationBankDetails = React.createRef();
        this.refFormRequisites = React.createRef();
        this.refRequisites = React.createRef();

        this.linkShare = (this.organizationId) ? `${urls["share-host"]}organization/${this.organizationId}` : null;

        props.history.replace('/organization');
    }

    componentDidMount = async () => {
        let organization = this.props.organization;
        const errorValidLegalForm = Boolean(organization?._id && !organization?.legal?._id);

        if (errorValidLegalForm) {
            const initLegal = await getLegalOrganization(organization?._id);
            const legal = {
                ...initLegal,
                info: getFormFromBody(organization, initLegal)
            };

            organization = {
                ...organization,
                legal
            };

            await this.props.setOrganization(organization);
        }

        await this.initialOrganization(organization);
        await this.getFormLegalList();
        await this.getUserPacketWiseWin();
        await this.getDocumentsOrganization();
        this.getPackets();
    }

    initialOrganization = async (initOrganization = this.state.organization) => {
        let organization = {...initOrganization};
        organization['placeId'] = (organization.address.placeId) ? organization.address.placeId : '';
        organization['addressDetails'] = (organization.address.details) ? organization.address.details : '';
        organization['primaryColor'] = (organization.colors) ? organization.colors.primary : '#0085FF';
        organization['inn'] = organization?.legal?.info?.inn || '';
        organization['website'] = organization?.website || "";
        organization['distributionSchema'] = {
            first: organization.distributionSchema.first,
            other: organization.distributionSchema.other * 20
        };
        organization['socialNetworks'] = {
            fb: organization['socialNetworks']['fb'].replace('https://fb.com/', ''),
            insta: organization['socialNetworks']['insta'].replace('https://instagram.com/', ''),
            vk: organization['socialNetworks']['vk'].replace('https://vk.com/', '')
        }
        organization['schedule'] = organization?.schedule || null;
        organization['picture'] = getMediaUrl(organization.pictureMedia) || organization.picture;
        organization['mainPicture'] = getMediaUrl(organization.mainPictureMedia) || organization.mainPicture;
        if (organization?.phones && organization.phones.length > 0) {
            let phones = [];

            organization.phones.map((phone) => {
                phones.push(phone.replace('+', ''));
            });

            organization['phones'] = phones;
        }
        if (!organization?.legal?.info) {
            organization.legal = {
                ...organization.legal,
                info: {}
            }
        }

        this.onChangeOrganization(organization);
        this.setState({
            isActiveBankDetails: Boolean(!organization.paymentShopId),
            isGlobalDisabled: Boolean(organization?._id)
        });

    }

    getFormLegalList = async () => {
        const countryLegalForms = await axiosInstance.get(`${urls['get-country-legal-forms']}?country=rus`).then((response) => {
            return response.data.data.legalForms
        });

        this.setState({countryLegalForms})
    }

    getUserPacketWiseWin = async () => {
        if (!this.props?.account?.wisewinId) {
            return null
        }

        const wiseWinPacket = await axiosInstance.get(urls['get-wisewin-statistics']).then((response) => {
            return response.data.data.wisewinPacket
        });

        this.setState({wiseWinPacket});
    }
    getPackets = () => {
        axiosInstance.get(`${ urls["get-packets"] }`).then((response) => {
            this.setState({
                packets: response.data.data.packets
            })
        })
    }

    onChangeOrganization = (organization) => {
        this.refFormMain.current?.setValues(organization);
        this.refFormMobile.current?.setValues(organization);
        this.refFormSecondary.current?.setValues(organization);
        this.refFormRequisites?.current?.setValues(organization?.legal?.info || {});

        this.setState({organization});
    }

    // Начало процесса сохранения организации
    onSaveForm = async () => {
        const isCreated = !Boolean(this.organizationId);

        // Проверка на валидность всех форм
        const isValid = await this.onCheckValidationForm(isCreated);
        if (!isValid) {
            return null
        }

        this.setState({ isSubmittingForm: true });

        // Подготовка данных для метода
        const form = await this.onGetFormDataOrganization();
        const methodSave = Boolean(this.organizationId) ? this.onSaveUpdateOrganization : this.onSaveCreateOrganization;
        const activePacketId = this.state.organization.packet;

        const responseSave = await methodSave(form);

        if (responseSave?.error) {

            await this.setState({ isSubmittingForm: false });

            alertNotification({
                title: responseSave.error.title,
                message: responseSave.error.message,
                type: 'danger'
            })

            return null
        }

        if (!isCreated){
            await this.onSetLegalOrganization({...this.state.organization}, false);
        }

        await this.onUpdateOrganization({isCreated});

        await this.setState({ isSubmittingForm: false });

        alertNotification({
            type: "success",
            title: responseSave?.success?.title || 'Уведомление системы',
            message: responseSave?.success?.message || isCreated ? 'Организация успешно создана' : 'Ошибка создания организации',
        })

        if (isCreated) {
            await this.setPacketOrganization({isCreate: true, activePacketId});

            this.props.setShowRegistrationOrganization(true);
            this.props.history.push('/')
        }
    }
    onSaveCreateOrganization = async (form) => {

        return await axiosInstance.post(`${urls["create-organization"]}`, form).then(async (response) => {

            return {
                success: {
                    title: allTranslations(localization.notificationSuccessTitleSuccess),
                    message: allTranslations(localization.notificationSuccessOrganizationEstablished)
                }
            }

        }).catch((error) => {
            const errorMessage = getErrorMessage(error);
            this.setState({isSubmittingForm: false});

            return {
                error: {
                    title: errorMessage.title,
                    message: errorMessage.message,
                }
            }

        })

    }
    onSaveUpdateOrganization = async (form) => {

        return await axiosInstance.put(`${urls["update-organization"]}${this.organizationId}`, form).then(async (response) => {

            return {
                success: {
                    title: allTranslations(localization.notificationSuccessTitleSuccess),
                    message: allTranslations(localization.notificationSuccessOrganizationUpdated),
                }
            }

        }).catch((error) => {
            const errorMessage = getErrorMessage(error);

            return {
                error: errorMessage
            }
        })

    }
    onSetLegalOrganization = async (organization, legalRelevant) => {
        const formLegal = {
            country: 'rus',
            form: organization.legal.form,
            info: getBodyFromForm(organization)
        };
        await setLegalOrganization(organization, formLegal, legalRelevant);

        return true
    }

    // Метод глобального обновления организации
    onUpdateOrganization = async ({ isCreated, form }) => {
        const resOrganization = await axiosInstance.get(urls["get-me-organization"]).then((response) => {
            return response.data.data.organization
        });

        if (isCreated) {
            await this.onSetLegalOrganization({...this.state.organization, _id: resOrganization?._id}, true);
        }

        const legal = await getLegalOrganization(resOrganization?._id);

        const organization = {
            ...resOrganization,
            legal: {
                ...legal,
                info: getFormFromBody(resOrganization, legal)
            }
        };

        this.props.setOrganization(organization);
        this.organizationId = organization._id;

        await this.setState({
            isSubmittingForm: false,
            organization
        });

        await this.initialOrganization();
        await this.getDocumentsOrganization();
        this.refRequisites.onChangeLegalForm();
    }
    // Метод устоновки пакета при регистрации
    setPacketOrganization = async ({isCreate, activePacketId}) => {
        const wiseWinPacket = this.state.wiseWinPacket;
        const packets = [...this.state.packets];
        const isFreePacketWiseWin = Boolean(packets.find((packet) => {
            if (packet._id === activePacketId) {
                return packet
            }
        })?.wisewinOption);

        if (isCreate) {

            if ( Boolean((!!wiseWinPacket && wiseWinPacket !== "default") && this.props?.account?.wisewinId && isFreePacketWiseWin) ) {
                // Если пользователь Wise Win выбрал при регистрации пакет беслптный
                await axiosInstance.put(`${urls["organizations-choose-wisewin-packet"]}/${activePacketId}`)

            } else {
                // Если пользователь Wise Win выбрал при регистрации пакет платный или пользователь выбрал пакет любой
                await axiosInstance.post(`${urls["request-packet"]}`, {
                    packetId: activePacketId,
                    email: this.props.account.email
                });
            }

        }

        return null
    }

    // Метод для создания запроса на изменения данных организации
    createLegalInfoRequest = async (comment) => {
        if (!this.state.isCreateLegalInfoRequest) {
            this.setState({
                isCreateLegalInfoRequest: true,
                isGlobalDisabled: false
            });

            return null
        }
        if (!comment) {
            this.setState({isOpenMessageChangeRequest: true});

            return null
        }

        await this.setState({isOpenMessageChangeRequest: false});
        const organization = {...this.state.organization};

        const isValid = await this.onCheckValidationForm();
        if (!isValid) {
            return null
        }

        await this.setState({ isSubmittingForm: true });

        const legal = {
            form: organization.legal.form,
            country: 'rus',
            info: getBodyFromForm(organization)
        };
        const legalId = await setLegalOrganization(organization, legal, false);

        if (legalId?.error) {
            alertNotification({
                title: allTranslations(localization.notificationErrorTitle),
                message: legalId?.error?.data?.error?.details,
                type: 'danger',
            })

            await this.setState({ isSubmittingForm: false });

            return null
        }

        const form = await this.getFormLegalInfoRequest(organization);

        const response = await axiosInstance.post(`${urls["organization-create-legal-info-request"]}`, {...form, comment, legalId}).then(async (response) => {
            return { success: true }
        }).catch((error) => {
            const errorMessage = getErrorMessage(error);

            return {
                error: {
                    title: errorMessage.title,
                    message: errorMessage.message,
                }
            }
        })

        await this.setState({ isCreateLegalInfoRequest: false });

        if (response.error) {
            alertNotification({
                title: response.error.title,
                message: response.error.message,
                type: 'danger',
            })
        }

        await this.onUpdateOrganization({});

        alertNotification({
            title: allTranslations(localization.notificationSuccessTitleSuccess),
            message: allTranslations(localization.notificationSuccessOrganizationChangeRequestSentSuccessfully),
            type: 'success',
        })

    }
    getFormLegalInfoRequest = async (organization) => {
        return {
            name: organization.name,
            userId: organization.user,
            organizationId: organization._id,
            addressId: await getAddressId(organization.placeId),
            phones: organization.phones,
            emails: organization.emails,
            categoryId: organization.category?._id
        }
    }

    // Получение документо организации
    getDocumentsOrganization = async () => {

        const documents = await axiosInstance.get(`${ urls["legal-get-organization-documents"] }/${ this.organizationId }`).then(( response ) => {
            return response.data.data.organizationDocuments
        }).catch(( error ) => {
           return []
        });
        let organizationDocuments = {};

        if (Boolean(documents.find((t) => t.type === 'treaty'))) {
            organizationDocuments.treaty = documents.find((t) => t.type === 'treaty');
        }
        if (Boolean(documents.find((t) => t.type === 'application'))) {
            organizationDocuments.application = documents.find((t) => t.type === 'application');
        }
        if (Boolean(documents.find((t) => t.type === 'packetPaymentAct'))) {
            organizationDocuments.packetPaymentAct = documents.find((t) => t.type === 'packetPaymentAct');
        }

        this.setState({
            organizationDocuments
        })

    }

    onCheckValidationForm = async (isCreated = false) => {
        let isValid = true;
        let errorTabs = [false, false, false];
        let errorMessages = [0, 0];

        let refFormMain = this.refFormMain.current;
        let refFormMobile = this.refFormMobile.current;
        let refFormSecondary = this.refFormSecondary.current;
        let refFormRequisites = this.refFormRequisites.current;

        await refFormMain.submitForm();
        await refFormMobile.submitForm();
        await refFormSecondary.submitForm();
        await refFormRequisites?.submitForm();

        const errorsFormMain = await refFormMain.validateForm();
        const errorsFormMobile = await refFormMobile.validateForm();
        const errorsFormSecondary = await refFormSecondary.validateForm();
        const errorsFormRequisites = await refFormRequisites?.validateForm();

        let isValidFormMain = Object.keys(errorsFormMain).length <= 0;
        let isValidFormMobile = Object.keys(errorsFormMobile).length <= 0;
        let isValidFormSecondary = Object.keys(errorsFormSecondary).length <= 0;
        let isValidFormRequisites = Object.keys(errorsFormRequisites || {}).length <= 0;
        // let isAddressValid = await getIsAddressValid(this.state.organization);
        //
        // console.log('isAddressValid: ', isAddressValid);

        if (!isValidFormMain) {
            isValid = false;
            errorTabs[0] = true;
            Object.keys(errorsFormMain).map((key) => {
                errorMessages[0]++
            });
        }
        if (!isValidFormMobile) {
            isValid = false;
            errorTabs[0] = true;

            Object.keys(errorsFormMobile).map((key) => {
                errorMessages[0]++
            });
        }
        if (!isValidFormSecondary) {
            isValid = false;
            errorTabs[0] = true;

            Object.keys(errorsFormSecondary).map((key) => {
                errorMessages[0]++
            });
        }
        if (!isValidFormRequisites) {
            this.refRequisites?.onCheckErrorTabs()

            isValid = false;
            errorTabs[1] = true;

            Object.keys(errorsFormRequisites).map((key) => {
                errorMessages[1]++
            });
        }

        if (!isValid) {
            let messages = [];
            if (errorMessages[0]) {
                messages.push(allTranslations(localization.organizationAboutErrorsFoundAboutCompany, {error: errorMessages[0]}))
            }
            if (errorMessages[1]) {
                messages.push(allTranslations(localization.organizationAboutErrorsFoundRequisites, {error: errorMessages[1]}))
            }
            if (errorMessages[3]) {
                messages.push(allTranslations(localization.organizationAboutErrorsFoundPackets, {error: 1}))
            }

            alertNotification({
                title: allTranslations(localization.notificationErrorTitle),
                message: (<Typography style={{color: 'white'}}
                                      dangerouslySetInnerHTML={{__html: messages.join('<br/><br/>')}}/>),
                type: 'danger',
            })

        }
        if (isValid) {
            var regexp = /[а-яё]/i;
            const addressId = this.state.organization?.placeId || this.state.organization?.address?.placeId;
            if (!regexp.test(addressId)) {

                alertNotification({
                    title: allTranslations(localization.notificationErrorTitle),
                    message: allTranslations(localization.organizationAboutErrorsOldAddress),
                    type: 'danger',
                })

                return null
            }

            let isValidate = Boolean((Number.parseFloat(this.state.organization.distributionSchema.first) + Number.parseFloat(this.state.organization.distributionSchema.other) + Number.parseFloat(this.state.organization.cashback) + 5) <= 50);
            if (!isValidate) {
                alertNotification({
                    title: "Системное уведомление",
                    message: 'В блоке "Базовая реферальная программа" сумма 1 уровня + 2-21 уровень + Расходы Adwise + Кэшбек покупателю не должны превышать 50%',
                    type: "warning"
                })

                return null
            }

            if (isCreated) {
                const isValidInn = await axiosInstance.get(`/v1/legal/check-legal-inn/${ this.state.organization?.legal?.info?.inn }`).then((res) => {
                    return !res.data.data.exists
                }).catch((err) => {
                    return false
                });
                if (!isValidInn) {
                    alertNotification({
                        title: "Системное уведомление",
                        message: 'Данный ИНН уже зарегистрирован в системе',
                        type: "danger"
                    })

                    return false
                }
            }
        }

        this.setState({errorTabs})

        return isValid
    }
    onGetFormDataOrganization = async () => {
        let organization = {...this.state.organization};
        let form = {};

        let tags = organization.tags.map((tag) => tag.name);
        let cashback = (organization.cashback) ? Number(organization.cashback) : 0;
        let phones = (organization.phones || []).map((phone) => {
            return phone
        });
        form.name = organization.name;
        form.cashback = cashback;
        form.description = organization.description;
        form.briefDescription = organization.briefDescription;
        form.colors = {
            primary: organization.primaryColor,
            secondary: organization.primaryColor,
        };
        form.tags = tags;
        form.emails = organization.emails || [];
        form.phones = phones;
        form.distributionSchema = this.getDistributionSchema(organization.distributionSchema);
        form.socialMedia = {
            vk: Boolean(organization.socialNetworks?.vk) ? `https://vk.com/${organization.socialNetworks.vk}` : '',
            insta: Boolean(organization.socialNetworks?.insta) ? `https://instagram.com/${organization.socialNetworks.insta}` : '',
            fb: Boolean(organization.socialNetworks?.fb) ? `https://fb.com/${organization.socialNetworks.fb}` : '',
        };
        form.addressId = await getAddressId(organization.placeId, organization?.addressDetails || organization?.address?.details);
        form.website = organization.website || '';
        form.schedule = this.getSchedule(organization);

        if (organization.category) {
            form.categoryId = organization.category._id;
        }
        if (organization.addressGps) {
            let gps = JSON.parse(organization.addressGps);
            form.addressCoords =[gps.lat, gps.lon];
        }
        if (organization.addressDetails) {
            form.addressDetails = organization.addressDetails;
        }

        if (!!organization.picture) {
            const isFile = Boolean(typeof organization.picture === 'object');

            if (isFile) {
                const picture = await fileOctetStreamToPng(organization.picture);
                form.pictureMediaId = await getMediaId(picture);
            } else {
                form.pictureMediaId = organization.pictureMedia;
            }
        }
        if (!!organization.mainPicture) {
            const isFile = Boolean(typeof organization.mainPicture === 'object');

            if (isFile) {
                const mainPicture = await fileOctetStreamToPng(organization.mainPicture);
                form.mainPictureMediaId = await getMediaId(mainPicture);
            } else {
                form.mainPictureMediaId = organization.mainPictureMedia;
            }
        }

        return form
    }
    getSchedule = (organization) => {
        let data = {};

        if (organization.mondayFrom && organization.mondayTo) {
            data.monday = {
                from: organization.mondayFrom || undefined,
                to: organization.mondayTo || undefined,
            }
        }
        if (organization.tuesdayFrom && organization.tuesdayTo) {
            data.tuesday = {
                from: organization.tuesdayFrom || undefined,
                to: organization.tuesdayTo || undefined
            }
        }
        if (organization.wednesdayFrom && organization.wednesdayTo) {
            data.wednesday = {
                from: organization.wednesdayFrom || undefined,
                to: organization.wednesdayTo || undefined,
            }
        }
        if (organization.thursdayFrom && organization.thursdayTo) {
            data.thursday = {
                from: organization.thursdayFrom || undefined,
                to: organization.thursdayTo || undefined
            }
        }
        if (organization.fridayFrom && organization.fridayTo) {
            data.friday = {
                from: organization.fridayFrom || undefined,
                to: organization.fridayTo || undefined
            }
        }
        if (organization.saturdayFrom && organization.saturdayTo) {
            data.saturday = {
                from: organization.saturdayFrom || undefined,
                to: organization.saturdayTo || undefined,
            }
        }
        if (organization.sundayFrom && organization.sundayTo) {
            data.sunday = {
                from: organization.sundayFrom || undefined,
                to: organization.sundayTo || undefined
            }
        }

        return Object.keys(data).length > 0 ? data : undefined
    }
    getDistributionSchema = (distributionSchema) => {
        return {
            first: Number.parseFloat(distributionSchema.first),
            other: Number.parseFloat(distributionSchema.other),
        }
    }

    onChangePicture = (picture) => {
        let newOrganization = {...this.state.organization};
        newOrganization.picture = picture;

        this.onChangeOrganization(newOrganization);
    }
    onChangeMainPicture = (mainPicture) => {
        let newOrganization = {...this.state.organization};
        newOrganization.mainPicture = mainPicture;

        this.onChangeOrganization(newOrganization);
    }

    onCopyLinkOrganization = () => {
        navigator.clipboard.writeText(this.linkShare).then(() => {

            alertNotification({
                title: allTranslations(localization.notificationSuccessTitleSuccess),
                message: allTranslations(localization.organizationAboutOrganizationLinkAddedClipboard),
                type: 'success',
            })

        });
    }

    openNotification = () => {

        alertNotification({
            title: allTranslations(localization.notificationSuccessTitleSuccess),
            message: allTranslations(localization.organizationAboutCompanyDataNotFilledCorrectly),
            type: 'success',
        })

    }

    onChangeColor = (primaryColor) => {
        let newOrganization = {...this.state.organization};

        newOrganization['primaryColor'] = primaryColor;

        this.onChangeOrganization(newOrganization)
    }

    onChangeTabs = ({target}, activeTab) => {
        this.setState({activeTab})
    }

    onSuccessSendBankData = () => {
        this.setState({
            activeTab: 'organization-about',
            isActiveBankDetails: false
        });
    }

    onChangeTariff = (id) => {
        let organization = {...this.state.organization};
        organization.packet = id;

        this.onChangeOrganization(organization);
    }

    _goPdfOrganization = () => {
        const application = this.props.organization.application;

        window.open(application);
    }
    _goPdfTreaty = () => {
        const treaty = this.props.organization.treaty;

        window.open(treaty);
    }

    render() {
        const {packets, isGlobalDisabled, isCreateLegalInfoRequest, isOpenDialogAddress, organizationDocuments} = this.state;
        const {classes, organization} = this.props;

        const typeLegalForm = this.state.organization?.legal?.form || "";
        const isShowTabOrganizationBankDetails = Boolean(typeLegalForm === "ip" || typeLegalForm === 'ooo');

        return (
            <Box position="relative">
                <Box mb={4}>
                    <Grid container spacing={2} alignItems="center">

                        <Grid item>
                            <Typography variant="h1">{allTranslations(localization.organizationAboutTitle)} <span
                                style={{color: '#8152E4'}}>{organization.name}</span></Typography>
                        </Grid>

                        <Grid item>
                            <Switch checked={Boolean(!organization.disabled)}/>
                        </Grid>

                    </Grid>
                </Box>

                <Box mb={4}>
                    <StagesDocumentVerification/>
                </Box>

                <Box mb={5}>
                    <Grid container spacing={7} alignItems={'center'}>
                        <Grid item>
                            <Tabs value={this.state.activeTab} onChange={this.onChangeTabs}>
                                <Tab value={'organization-about'}
                                     label={(
                                         <span>{allTranslations(localization.organizationAboutTabsAboutCompany)} {(this.state.errorTabs[0]) && (
                                             <Badge badgeContent={1} variant="dot" color="primary"
                                                    style={{marginTop: -10, backgroundColor: '#DB4368'}}/>)}</span>)}/>
                                <Tab value={'organization-requisites'}
                                     label={(
                                         <span>{allTranslations(localization.organizationAboutTabsRequisites)} {(this.state.errorTabs[1]) && (
                                             <Badge badgeContent={1} variant="dot" color="primary"
                                                    style={{marginTop: -10, backgroundColor: '#DB4368'}}/>)}</span>)}/>
                                {
                                    (isShowTabOrganizationBankDetails) && (
                                        <Tab value={'organization-bank-details'} label={(
                                            <span>{allTranslations(localization.organizationAboutTabsBankPoints)} {(this.state.errorTabs[2]) && (
                                                <Badge badgeContent={1} variant="dot" color="primary"
                                                       style={{
                                                           marginTop: -10,
                                                           backgroundColor: '#DB4368'
                                                       }}/>)}</span>)}/>
                                    )
                                }
                            </Tabs>
                        </Grid>

                        {
                            (!!this.linkShare) && (
                                <Grid item>
                                    <Link
                                        target={'_blank'}
                                        href={this.linkShare}
                                        className={classes.link}
                                    >{this.linkShare}</Link>

                                    <Button variant={'text'} onClick={this.onCopyLinkOrganization}>
                                        <CopyIcon/>
                                    </Button>
                                </Grid>
                            )
                        }
                    </Grid>
                </Box>

                <TabContent active={this.state.activeTab === 'organization-about'}>
                    <Grid container spacing={8}>
                        <Grid item xs={8}>
                            <Grid container spacing={8}>
                                <Grid item xs={6}>

                                    <Box mb={5}>
                                        <FormMain
                                            setRef={this.refFormMain}
                                            refRequisites={this.refRequisites}
                                            refFormRequisites={this.refFormRequisites}

                                            isGlobalDisabled={isGlobalDisabled}
                                            isCreated={!organization._id}
                                            organization={this.state.organization}
                                            countryLegalForms={this.state.countryLegalForms}
                                            packets={packets}
                                            wiseWinPacket={this.state.wiseWinPacket}

                                            onChangeOrganization={this.onChangeOrganization}
                                            onOpenAddress={() => this.setState({isOpenDialogAddress: true})}
                                        />
                                    </Box>

                                    <Box>
                                        <FormSecondary
                                            setRef={this.refFormSecondary}

                                            isGlobalDisabled={isGlobalDisabled}
                                            organization={this.state.organization}
                                            onChangeOrganization={this.onChangeOrganization}
                                        />
                                    </Box>

                                </Grid>
                                <Grid item xs={6}>
                                    <Box mb={5}>
                                        <FormMobile
                                            setRef={this.refFormMobile}

                                            organization={this.state.organization}
                                            picture={this.state.organization.picture}
                                            mainPicture={this.state.organization.mainPicture}

                                            onChangeOrganization={this.onChangeOrganization}
                                            onChangePicture={this.onChangePicture}
                                            onChangeMainPicture={this.onChangeMainPicture}
                                        />
                                    </Box>

                                    <Box mb={5}>
                                        <ColorPicker
                                            color={this.state.organization.primaryColor}

                                            onChangeColor={this.onChangeColor}
                                        />
                                    </Box>

                                    <Box mb={5}>
                                        <ReferralSystem
                                            organization={this.state.organization}

                                            onChange={this.onChangeOrganization}
                                        />
                                    </Box>

                                    <Box mb={5}>
                                        <FormSocials
                                            organization={this.state.organization}
                                            onChange={this.onChangeOrganization}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>

                            <Box mb={2}>
                                <Typography
                                    variant={'formTitle'}
                                    className={classes.titleMobileSection}
                                    dangerouslySetInnerHTML={{__html: allTranslations(localization.organizationAboutExampleDisplayClientPhone)}}
                                />
                            </Box>

                            <Box mb={5}>
                                <MobileCardOrganization
                                    organization={this.state.organization}

                                    newPicture={this.state.organization.picture}
                                    newMainPicture={this.state.organization.mainPicture}
                                />
                            </Box>

                        </Grid>
                    </Grid>
                </TabContent>
                <TabContent active={this.state.activeTab === 'organization-requisites'}>
                    <FormRequisites
                        ref={el => this.refRequisites = el}
                        setRef={this.refFormRequisites}
                        isGlobalDisabled={isGlobalDisabled}
                        organization={this.state.organization}
                        onChange={this.onChangeOrganization}
                        organizationDocuments={organizationDocuments}
                    />
                </TabContent>
                <TabContent active={this.state.activeTab === 'organization-bank-details'}>
                    <FormOrganizationBankDetails
                        organization={this.state.organization}
                        onSuccessSend={this.onSuccessSendBankData}
                    />
                </TabContent>
                <TabContent active={this.state.activeTab === 'organization-credit-card-link'}>
                    <FormOrganizationCreditCardLink
                        organization={this.state.organization}
                    />
                </TabContent>

                {
                    (this.state.activeTab !== 'organization-bank-details' && this.state.activeTab !== 'organization-credit-card-link') && (
                        <>

                            {
                                (isGlobalDisabled || !isCreateLegalInfoRequest) && (
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <Button variant={"contained"} onClick={this.onSaveForm}>
                                                {allTranslations(localization.commonSave)}
                                            </Button>
                                        </Grid>

                                        {
                                            isGlobalDisabled && (
                                                <Grid item>
                                                    <Button variant={"contained"} onClick={() => this.createLegalInfoRequest()}>
                                                        {allTranslations(localization.organizationAboutButtonsChangeData)}
                                                    </Button>
                                                </Grid>
                                            )
                                        }
                                    </Grid>
                                )
                            }

                            {
                                (!isGlobalDisabled && isCreateLegalInfoRequest) && (
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <Button variant={"contained"} onClick={() => this.createLegalInfoRequest()}>
                                                {allTranslations(localization.organizationAboutButtonsRequestDataChanges)}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )
                            }

                        </>
                    )
                }

                <MessageChangeRequest
                    isOpen={this.state.isOpenMessageChangeRequest}
                    onClose={() => this.setState({isOpenMessageChangeRequest: false})}
                    onSubmit={this.createLegalInfoRequest}
                />

                <Backdrop open={this.state.isSubmittingForm} invisible={this.state.isSubmittingForm}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

                <DialogAddress
                    isOpen={isOpenDialogAddress}
                    isGlobalDisabled={isGlobalDisabled}
                    organization={this.state.organization}
                    onClose={() => this.setState({isOpenDialogAddress: false})}
                    onSave={this.onChangeOrganization}
                />
            </Box>
        );
    }
}

const TabContent = (props) => {
    return (
        <div style={
            (!props.active) ? {display: 'none'} : {}
        }>
            {props.children}
        </div>
    )
}

const styles = {
    link: {
        fontSize: 16,
        lineHeight: '19px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    titleMobileSection: {
        fontWeight: "500"
    }
};

export default withStyles(styles)(OrganizationAbout)
