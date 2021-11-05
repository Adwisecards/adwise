import React, {PureComponent} from "react";
import {
    Box,
    Tab,
    Tabs,
    Grid,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    Backdrop,
    CircularProgress
} from "@material-ui/core";
import {
    withStyles
} from "@material-ui/styles";
import {compose} from "recompose";
import {connect} from "react-redux";
import {Formik} from "formik";
import {
    setAccount
} from "../../../../../AppState";
import * as Yup from "yup";
import {
    ComponentAddress,
    ComponentDate,
    ComponentInput
} from "./components";
import axiosInstance from "../../../../../agent/agent";
import urls from "../../../../../constants/urls";
import {store} from "react-notifications-component";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import alertNotification from "../../../../../common/alertNotification";

class FormRequisites extends PureComponent{
    constructor(props) {
        super(props);

        this.state = {
            initialForm: {
                fullName: "",
                dob: null,
                placeOfBirth: "",
                citizenship: "",
                inn: "",
                ogrnip: "",

                identityDocument: "",
                identityDocumentSerialNumber: "",
                identityDocumentDateIssue: "",
                identityDocumentIssuedBy: "",
                identityDocumentDepartmentCode: "",

                residenceAddressIndex: "",
                residenceAddress: "",

                mailingAddressIndex: "",
                mailingAddress: "",

                phoneNumber: "",
                emailAddress: "",

                bankName: "",
                bik: "",
                korAccount: "",
                account: "",
            },

            form: "individualManager",
            tab: "basic_information",

            isShowBackdrop: false,
            isInitForm: false
        }

        this.refFormik = React.createRef();
    }

    componentDidMount = () => {
        this.onSetRequisites();
    }

    onSetRequisites = () => {
        const { account } = this.props.app;
        const info = account?.legal?.info || {};
        let initialForm = {...this.state.initialForm};
        Object.keys(initialForm).map((key) => {
            if (Boolean(info[key])){
                initialForm[key] = info[key]
            }
        })

        this.refFormik.current.setValues(initialForm);
        this.setState({
            form: account?.legal?.form || "individualManager",
            isInitForm: true
        })
    }
    onChangeRequisites = async (form) => {
        this.setState({isShowBackdrop: true})

        let legal = {
            form: this.state.form,
            country: 'rus',
            info: {...form}
        };

        let formData = new FormData();
        formData.append("legal", JSON.stringify(legal));

        await axiosInstance.put(urls["update-user"], formData).then((res) => {

            alertNotification({
                title: allTranslations(localization.notificationSystemNotification),
                message: allTranslations(localization.managerFormRequsitesSuccessChange),
                type: 'success',
            })

        });
        const account = await axiosInstance.get(urls["get-me"]).then((res) => {
            return res.data.data.user
        });

        this.props.setAccount(account);

        this.setState({isShowBackdrop: false})
    }

    onChangeForm = ({target}) => {
        const { name, value } = target;
        let form = this.refFormik.current.values;
        form[name] = value;
        this.refFormik.current.setValues(form);
    }

    render() {
        const { form, tab, initialForm } = this.state;
        const { classes } = this.props;

        return (
            <>

                <Box mb={5} width="100%">
                    <Grid container>
                        <Grid item xs={3}>
                            <Typography>{allTranslations(localization['managerAbout.formRequisites.legalForm'])}</Typography>
                            <FormControl variant="outlined" fullWidth>
                                <Select
                                    value={form}
                                    fullWidth
                                    onChange={({target}) => this.setState({form: target.value})}
                                >
                                    <MenuItem value="individualManager">{allTranslations(localization['managerAbout.formRequisites.individualManager'])}</MenuItem>
                                    <MenuItem value="ipManager">{allTranslations(localization['managerAbout.formRequisites.ipManager'])}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>

                <Formik
                    innerRef={this.refFormik}
                    initialValues={initialForm}
                    validationSchema={(form === 'individualManager') ? validationSchemaIndividual : validationSchemaIp}

                    onSubmit={this.onChangeRequisites}
                >
                    {(props) => {
                        const { values, errors, touched, handleSubmit } = props;

                        if (!this.state.isInitForm) {
                            return (<></>)
                        }

                        return (
                            <>

                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Box mb={4}>
                                            <Typography variant="h3">{allTranslations(localization['managerAbout.formRequisites.basicInformation'])}</Typography>
                                        </Box>

                                        {/*Наименование Исполнителя*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="Наименование Исполнителя"
                                                placeholder="Иванов И.И."
                                                name="fullName"
                                                value={values.fullName}
                                                error={Boolean(errors.fullName && touched.fullName)}
                                                helperText={errors.fullName}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*Дата рождения*/}
                                        <Box mb={3}>
                                            <ComponentDate
                                                title="Дата рождения"
                                                placeholder="ДД.ММ.ГГГГ"
                                                name="dob"
                                                value={values.dob}
                                                error={Boolean(errors.dob && touched.dob)}
                                                helperText={errors.dob}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*Место рождения*/}
                                        <Box mb={3}>
                                            <ComponentAddress
                                                title="Место рождения"
                                                placeholder="Екатерибург"
                                                name="placeOfBirth"
                                                value={values.placeOfBirth}
                                                error={Boolean(errors.placeOfBirth && touched.placeOfBirth)}
                                                helperText={errors.placeOfBirth}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*Гражданство*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="Гражданство"
                                                placeholder="Россия"
                                                name="citizenship"
                                                value={values.citizenship}
                                                error={Boolean(errors.citizenship && touched.citizenship)}
                                                helperText={errors.citizenship}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*ИНН*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="ИНН"
                                                placeholder="1234567890"
                                                name="inn"
                                                value={values.inn}
                                                error={Boolean(errors.inn && touched.inn)}
                                                helperText={errors.inn}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*ОГРНИП*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="ОГРНИП"
                                                placeholder="1234567890"
                                                name="ogrnip"
                                                value={values.ogrnip}
                                                error={Boolean(errors.ogrnip && touched.ogrnip)}
                                                helperText={errors.ogrnip}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box mb={4}>
                                            <Typography variant="h3">Информация об менеджере</Typography>
                                        </Box>
                                        <Box mb={2}>
                                            <Typography variant="h5">Документы</Typography>
                                        </Box>
                                        {/*Наименование документа, удостоверяющего личность*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="Наименование документа, удостоверяющего личность"
                                                placeholder="Паспорт"
                                                name="identityDocument"
                                                value={values.identityDocument}
                                                error={Boolean(errors.identityDocument && touched.identityDocument)}
                                                helperText={errors.identityDocument}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*Серия номер документа*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="Серия номер документа"
                                                placeholder="1111 222222"
                                                name="identityDocumentSerialNumber"
                                                value={values.identityDocumentSerialNumber}
                                                error={Boolean(errors.identityDocumentSerialNumber && touched.identityDocumentSerialNumber)}
                                                helperText={errors.identityDocumentSerialNumber}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*Дата выдачи документа*/}
                                        <Box mb={3}>
                                            <ComponentDate
                                                title="Дата выдачи документа"
                                                placeholder="ДД.ММ.ГГГГ"
                                                name="identityDocumentDateIssue"
                                                value={values.identityDocumentDateIssue}
                                                error={Boolean(errors.identityDocumentDateIssue && touched.identityDocumentDateIssue)}
                                                helperText={errors.identityDocumentDateIssue}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*Кем выдан документ*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="Кем выдан документ"
                                                placeholder="УВД по Городу Екатеринбургу"
                                                name="identityDocumentIssuedBy"
                                                value={values.identityDocumentIssuedBy}
                                                error={Boolean(errors.identityDocumentIssuedBy && touched.identityDocumentIssuedBy)}
                                                helperText={errors.identityDocumentIssuedBy}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*Код подразделения выдачи документа*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="Код подразделения выдачи документа"
                                                placeholder="5478962"
                                                name="identityDocumentDepartmentCode"
                                                value={values.identityDocumentDepartmentCode}
                                                error={Boolean(errors.identityDocumentDepartmentCode && touched.identityDocumentDepartmentCode)}
                                                helperText={errors.identityDocumentDepartmentCode}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>

                                        <Box mb={2}>
                                            <Typography variant="h5">Адреса</Typography>
                                        </Box>
                                        {/*Адрес места жительства (регистрации)(ИНДЕКС)*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="Индекс места жительства (регистрации)"
                                                placeholder="5478962"
                                                name="residenceAddressIndex"
                                                value={values.residenceAddressIndex}
                                                error={Boolean(errors.residenceAddressIndex && touched.residenceAddressIndex)}
                                                helperText={errors.residenceAddressIndex}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*Адрес места жительства (регистрации)(АДРЕС)*/}
                                        <Box mb={3}>
                                            <ComponentAddress
                                                title="Адрес места жительства (регистрации)"
                                                placeholder="Екатерибург"
                                                name="residenceAddress"
                                                value={values.residenceAddress}
                                                error={Boolean(errors.residenceAddress && touched.residenceAddress)}
                                                helperText={errors.residenceAddress}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>

                                        {/*Индекс почтовый адрес*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="Индекс почтовый адрес"
                                                placeholder="5478962"
                                                name="mailingAddressIndex"
                                                hint="заполняется, если отличается от места регистрации"
                                                value={values.mailingAddressIndex}
                                                error={Boolean(errors.mailingAddressIndex && touched.mailingAddressIndex)}
                                                helperText={errors.mailingAddressIndex}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*Адрес Почтовый адрес*/}
                                        <Box mb={3}>
                                            <ComponentAddress
                                                title="Почтовый адрес"
                                                placeholder="Екатерибург"
                                                name="mailingAddress"
                                                hint="заполняется, если отличается от места регистрации"
                                                value={values.mailingAddress}
                                                error={Boolean(errors.mailingAddress && touched.mailingAddress)}
                                                helperText={errors.mailingAddress}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>

                                        <Box mb={2}>
                                            <Typography variant="h5">Контактные данные</Typography>
                                        </Box>
                                        {/*Номер телефона*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="Номер телефона"
                                                placeholder="79000000000"
                                                name="phoneNumber"
                                                value={values.phoneNumber}
                                                error={Boolean(errors.phoneNumber && touched.phoneNumber)}
                                                helperText={errors.phoneNumber}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*Адрес электронной почты*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="Адрес электронной почты"
                                                placeholder="..."
                                                name="emailAddress"
                                                value={values.emailAddress}
                                                error={Boolean(errors.emailAddress && touched.emailAddress)}
                                                helperText={errors.emailAddress}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box mb={4}>
                                            <Typography variant="h3">Банк</Typography>
                                        </Box>
                                        {/*Наименование Банка*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="Наименование Банка"
                                                placeholder="..."
                                                name="bankName"
                                                value={values.bankName}
                                                error={Boolean(errors.bankName && touched.bankName)}
                                                helperText={errors.bankName}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*БИК*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="БИК Банка"
                                                placeholder="..."
                                                name="bik"
                                                value={values.bik}
                                                error={Boolean(errors.bik && touched.bik)}
                                                helperText={errors.bik}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*Кор. счет Банка*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="Кор. счет Банка"
                                                placeholder="..."
                                                name="korAccount"
                                                value={values.korAccount}
                                                error={Boolean(errors.korAccount && touched.korAccount)}
                                                helperText={errors.korAccount}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                        {/*Расчетный счет*/}
                                        <Box mb={3}>
                                            <ComponentInput
                                                title="Расчетный счет"
                                                placeholder="..."
                                                name="account"
                                                value={values.account}
                                                error={Boolean(errors.account && touched.account)}
                                                helperText={errors.account}
                                                onChange={this.onChangeForm}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Box mt={2}>
                                    <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
                                </Box>

                            </>
                        )
                    }}
                </Formik>

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        )
    }
}

const styles = {
    tabs: {
        padding: 0,
        borderRadius: 0,
        minHeight: 'auto',
        background: 'transparent',

        borderBottom: "1px solid #CBCCD4",

        '& .MuiButtonBase-root': {
            borderRadius: 0,
            boxShadow: "none!important",
            fontSize: 22,
            lineHeight: '26px',
            letterSpacing: '0.02em',
            fontFeatureSettings: "'ss03' on, 'ss06' on",
            color: "#999DB1",
            maxWidth: 'initial'
        },

        '& .Mui-selected': {
            position: 'relative',
            color: "#8152E4",
            "&:before": {
                content: "''",
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -1,
                background: '#8152E4',
                height: 3
            }
        }
    },
    hidden: {
        display: 'none'
    }
};

const validationSchemaIndividual = Yup.object().shape({
    fullName: Yup.string().required('Обязательно к заполнению'),
    dob: Yup.string().matches(/^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)/i, 'Запишите пожалуйста дату рождения в формате дд.мм.гггг'),
    citizenship: Yup.string().required('Обязательно к заполнению'),
    inn: Yup.string().length(12, "ИНН должен содержать 12 цифр").required('Обязательно к заполнению').matches(/^[0-9]+.$/, "ИНН может содержать только числа"),
    ogrnip: Yup.string().length(15, "ОГРНИП должен содержать 15 цифр"),
    identityDocument: Yup.string().required('Обязательно к заполнению'),
    identityDocumentSerialNumber: Yup.string().required('Обязательно к заполнению'),
    identityDocumentDateIssue: Yup.string().required('Обязательно к заполнению'),
    identityDocumentIssuedBy: Yup.string().required('Обязательно к заполнению'),
    identityDocumentDepartmentCode: Yup.string().required('Обязательно к заполнению'),
    residenceAddressIndex: Yup.string().required('Обязательно к заполнению'),
    residenceAddress: Yup.string().required('Обязательно к заполнению'),
    phoneNumber: Yup.string().required('Обязательно к заполнению'),
    emailAddress: Yup.string().email("Не правильно введен Email адрес").required('Обязательно к заполнению'),

    bankName: Yup.string().required('Обязательно к заполнению'),
    bik: Yup
        .string()
        .matches(
            /^[0-9]{8}.$/,
            "БИК банка должен состоять из 9 цифр"
        )
        .required('Обязательно к заполнению'),
    korAccount: Yup
        .string()
        .matches(
            /^[0-9]{19}.$/,
            "Корреспондентский счет должен состоять из 20 цифр"
        )
        .required('Обязательно к заполнению'),
    account: Yup
        .string()
        .required('Обязательно к заполнению')
        .matches(
            /^[0-9]{19}.$/,
            "Расчетный счет должен состоять из 20 цифр"
        ),
});
const validationSchemaIp = Yup.object().shape({
    fullName: Yup.string().required('Обязательно к заполнению'),
    dob: Yup.string().matches(/^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)/i, 'Запишите пожалуйста дату рождения в формате дд.мм.гггг'),
    citizenship: Yup.string().required('Обязательно к заполнению'),
    inn: Yup.string().length(12, "ИНН должен содержать 12 цифр").required('Обязательно к заполнению').matches(/^[0-9]+.$/, "ИНН может содержать только числа"),
    ogrnip: Yup.string().length(15, "ОГРНИП должен содержать 15 цифр").required('Обязательно к заполнению'),
    identityDocument: Yup.string().required('Обязательно к заполнению'),
    identityDocumentSerialNumber: Yup.string().required('Обязательно к заполнению'),
    identityDocumentDateIssue: Yup.string().required('Обязательно к заполнению'),
    identityDocumentIssuedBy: Yup.string().required('Обязательно к заполнению'),
    identityDocumentDepartmentCode: Yup.string().required('Обязательно к заполнению'),
    residenceAddressIndex: Yup.string().required('Обязательно к заполнению'),
    residenceAddress: Yup.string().required('Обязательно к заполнению'),
    phoneNumber: Yup.string().required('Обязательно к заполнению'),
    emailAddress: Yup.string().email("Не правильно введен Email адрес").required('Обязательно к заполнению'),
    bankName: Yup.string().required('Обязательно к заполнению'),
    bik: Yup
        .string()
        .required('Обязательно к заполнению')
        .matches(
            /^[0-9]{8}.$/,
            "БИК банка должен состоять из 9 цифр"
        ),
    korAccount: Yup
        .string()
        .required('Обязательно к заполнению')
        .matches(
            /^[0-9]{19}.$/,
            "Корреспондентский счет должен состоять из 20 цифр"
        ),
    account: Yup
        .string()
        .required('Обязательно к заполнению')
        .matches(
            /^[0-9]{19}.$/,
            "Расчетный счет должен состоять из 20 цифр"
        ),
});

const FormRequisitesStyles = withStyles(styles)(FormRequisites);

export default compose(
    connect(
        state => ({
            app: state.app
        }),
        dispatch => ({
            setAccount: (account) => dispatch(setAccount(account))
        }),
    ),
)(FormRequisitesStyles);
