import React, {PureComponent} from "react";
import {
    Box,
    Tab,
    Tabs,
    Grid,
    Badge,
    Button,
    Typography,
    TextField
} from "@material-ui/core";
import {
    withStyles
} from "@material-ui/styles";
import {Formik} from "formik";
import {
    ComponentAddress,
    ComponentInput,
    ComponentDate,
    ComponentBankCard,
    ComponentSelect,
    ComponentPhone
} from "./components";
import {getDataBankFromBik, getDataOrganizationFromInn} from "../../../../../helper/organizationDadata";
import individualForm from "../../../../../legalForms/forms/individual";
import ipForm from "../../../../../legalForms/forms/ip";
import oooForm from "../../../../../legalForms/forms/ooo";
import clsx from "clsx";
import * as Yup from "yup";
import alertNotification from "../../../../../common/alertNotification";
import DadataForm from "../../../../../icons/organization/DadataForm";
import urls from "../../../../../constants/urls";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import {getMediaUrl} from "../../../../../common/media";

const formsLegal = {
    individual: individualForm,
    ip: ipForm,
    ooo: oooForm,
};
const formDadataValidation = {
    individual: {
        inn: allTranslations(localization.organizationAboutCountSymbol, {count: 12}),
        innLength: 12,
    },
    ip: {
        inn: allTranslations(localization.organizationAboutCountSymbol, {count: 12}),
        innLength: 12,
    },
    ooo: {
        inn: allTranslations(localization.organizationAboutCountSymbol, {count: 10}),
        innLength: 10,
    },
}
const legalNames = {
    individual: allTranslations(localization.documentTypesIndividual),
    ip: allTranslations(localization.documentTypesIp),
    ooo: allTranslations(localization.documentTypesOoo),
};

class FormRequisites extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            inn: "",
            bik: "",

            forms: null,
            validationSchema: null,
            errorTabs: {},

            legalForm: "",
            tab: "",

            showFormDadata: false
        }
    }

    componentDidMount = () => {
        this.onChangeLegalForm();
    }

    checkShowDadata = () => {
        const {organization} = this.props;
        const isInn = Boolean(organization?.legal?.info?.inn || false);
        const isBik = Boolean(organization?.legal?.info?.['bankAccount.bik'] || false);

        this.setState({
            showFormDadata: !Boolean(isInn && isBik)
        })
    }

    onChangeLegalForm = (legal = "") => {
        const {setRef} = this.props;
        const legalForm = legal || this.props?.organization?.legal?.form || "";

        if (!legalForm) {
            return null
        }

        setRef.current?.setErrors({});

        this.setState({
            legalForm,
            forms: formsLegal[legalForm],
            tab: formsLegal[legalForm][0]['tab']['value'],
            validationSchema: this.getValidationSchema(formsLegal[legalForm]),
            showFormDadata: true,
            inn: '',
            bik: ''
        }, () => {
            this.checkShowDadata();
            this.onCheckErrorTabs();
        })
    }
    getValidationSchema = (forms) => {
        let validationSchemaInit = {};

        forms.map((form) => {
            (form?.sections || []).map((section) => {
                section.items.map((item) => {
                    if (!!item.validationSchema) {
                        validationSchemaInit[item.name] = item.validationSchema;
                    }
                })
            })
        })

        return Yup.object().shape(validationSchemaInit)
    }

    onChangeForm = ({target}) => {
        const {organization, setRef, onChange} = this.props;
        const {name, value} = target;

        let newForm = setRef.current.values;
        newForm[name] = value;

        let newOrganization = {...organization};
        newOrganization.legal.info = newForm;

        onChange(newOrganization)
    }
    onSubmit = () => {
        this.onCheckErrorTabs();
    }

    onChangeInnDadata = ({target}) => {
        this.setState({
            inn: target.value.replace(/\s+/g, ' ').trim()
        })
    }
    onChangeBikDadata = ({target}) => {
        this.setState({
            bik: target.value.replace(/\s+/g, ' ').trim()
        })
    }
    onDadataSubmit = async () => {
        const {organization, setRef, onChange} = this.props;
        const {inn, bik} = this.state;
        let responseOrganization = null;
        let responseBank = null;

        if (!!inn) {
            responseOrganization = await getDataOrganizationFromInn({query: inn, bik: bik}).then((res) => {
                return res?.suggestions[0] || null
            });

        }
        if (!!bik) {
            responseBank = await getDataBankFromBik({query: bik}).then((res) => {
                return res?.suggestions[0] || null
            });
        }

        if (!inn) {
            alertNotification({
                title: allTranslations(localization.notificationSystemNotification),
                message: allTranslations(localization.organizationAboutNotOrganizationFromInn),
                type: "info"
            })
        }
        if (!bik) {
            alertNotification({
                title: allTranslations(localization.notificationSystemNotification),
                message: allTranslations(localization.organizationAboutNotOrganizationFromBic),
                type: "info"
            })
        }

        let newInfo = setRef.current.values;

        newInfo.organizationName = responseOrganization?.data?.name?.short_with_opf || newInfo.name;
        newInfo.ogrn = responseOrganization?.data?.ogrn || newInfo.ogrnip ||newInfo.ogrn;
        newInfo.inn = responseOrganization?.data?.inn || newInfo.inn;
        newInfo.kpp = responseOrganization?.data?.kpp || newInfo.kpp;
        newInfo['addresses.legal.city'] = responseOrganization?.data?.address?.unrestricted_value || newInfo['addresses.legal.city'];
        newInfo['addresses.legal.zip'] = responseOrganization?.data?.address?.data?.postal_code || newInfo['addresses.legal.zip'];
        newInfo['addresses.legal.street'] = responseOrganization?.data?.address?.value || newInfo['addresses.legal.street'];

        newInfo['bankAccount.name'] = responseBank?.data?.name?.payment || newInfo['bankAccount.name'];
        newInfo['bankAccount.bik'] = responseBank?.data?.bic || newInfo['bankAccount.bik'];
        newInfo['bankAccount.korAccount'] = responseBank?.data?.correspondent_account || newInfo['bankAccount.korAccount'];

        let newOrganization = {...organization};
        newOrganization.legal.info = newInfo;

        onChange(newOrganization)

        this.setState({
            showFormDadata: false
        })
    }
    onHideFormDadata = () => {
        this.setState({showFormDadata: false})
    }

    onCheckErrorTabs = () => {
        const {setRef} = this.props;
        const {forms} = this.state;
        const errors = setRef.current?.errors || {};

        let errorTabs = {};

        forms.map((form) => {
            errorTabs[form.tab.value] = 0;

            form.sections.map((section) => {
                section.items.map((item) => {
                    if (errors[item.name]) {
                        errorTabs[form.tab.value] = 1;
                    }
                })
            })
        })

        this.setState({errorTabs});
    }

    onDownloadRequisites = async () => {
        const {organization} = this.props;

        if (organization.application){
            const file = await this.handleGetFileFromLink(`${process.env.REACT_APP_PRODUCTION_HOST_API}${urls["organization-get-organization-documents"]}/${organization._id}`, 'adwise_crm_docs', 'application/octet-stream');
            if (file){
                var downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(file);
                downloadLink.download = "adwise_crm_docs.zip";

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        }
    }
    handleGetFileFromLink = async (url, name, defaultType = 'application/octet-stream') => {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                authentication: localStorage.getItem('jwt')
            }
        });

        if (!response) {
            return null
        }

        const data = await response.blob();
        return new Blob([data], {
            type: defaultType,
        });
    }

    _openDocumentLink = (doc) => {
        const { documentMedia } = doc;
        const documentUrl = getMediaUrl(documentMedia);

        let link = document.createElement('a');
        document.body.appendChild(link);
        link.download = 'act';
        link.target = '_blank';
        link.href = documentUrl;
        link.click();
        document.body.removeChild(link);
    }

    render() {
        const {forms, tab, legalForm, inn, bik, errorTabs, showFormDadata, validationSchema} = this.state;
        const {setRef, classes, organization, isGlobalDisabled, organizationDocuments} = this.props;
        const isDownloadRequisites = Boolean(organization?.application || false);


        if (!legalForm) {
            return (
                <Box mb={5}>
                    <Typography variant="h4">
                        {allTranslations(localization.organizationAboutBeforeFillingRequisitesChooseLegalOrganization)}
                    </Typography>
                </Box>
            )
        }

        return (
            <Box className="form-requisites">

                {
                    Boolean(showFormDadata) && (
                        <Box mb={5}>
                            <Grid container spacing={3}>
                                <Grid item>
                                    <Box className={classes.containerDadata}>
                                        <Typography className={classes.containerDadataTitle}>
                                            {allTranslations(localization.organizationAboutAutomaticFillingOrganizationData)}
                                        </Typography>
                                        <Typography className={classes.containerDadataCaption}>
                                            {allTranslations(localization.organizationAboutSelectOrganizationLegalForm, {legalForm: legalNames[legalForm]})}
                                        </Typography>

                                        <Box mb={3}>
                                            <Grid container spacing={4}>
                                                <Grid item xs={6}>
                                                    <Typography style={{marginBottom: 9}} variant="formTitle">{allTranslations(localization.organizationAboutInnOrganization)}</Typography>
                                                    <TextField
                                                        value={inn}
                                                        fullWidth
                                                        variant="outlined"
                                                        onChange={this.onChangeInnDadata}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography style={{marginBottom: 9}} variant="formTitle">
                                                        {allTranslations(localization.organizationAboutBikBank)}
                                                    </Typography>
                                                    <TextField
                                                        value={bik}
                                                        fullWidth
                                                        variant="outlined"
                                                        onChange={this.onChangeBikDadata}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>

                                        <Grid container spacing={1}>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    className={classes.buttonFormDadata}
                                                    disabled={
                                                        (!inn || inn.length !== formDadataValidation[legalForm]['innLength']) &&
                                                        (!bik || bik.length !== 9)
                                                    }
                                                    onClick={this.onDadataSubmit}
                                                >{allTranslations(localization.commonFill)}</Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant="outlined"
                                                    className={classes.buttonFormDadata}
                                                    onClick={this.onHideFormDadata}
                                                >
                                                    {allTranslations(localization.commonSkip)}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Box mb={2}>
                                        <DadataForm/>
                                    </Box>
                                    <Box mb={1} maxWidth={230}>
                                        <Typography variant="subtitle2" style={{color: "black"}}>
                                            {allTranslations(localization.organizationAboutAutocompleteForm)}
                                        </Typography>
                                    </Box>
                                    <Box maxWidth={230}>
                                        <Typography
                                            variant="body2"
                                            dangerouslySetInnerHTML={{__html: allTranslations(localization.organizationAboutAutocompleteFormMessage)}}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )
                }

                <Box mb={4}>
                    <Grid container spacing={3} alignItems="center">
                        {
                            Boolean(Object.keys(setRef?.current?.errors || {}).length > 0) && (
                                <Grid item>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Box width={7} height={7} borderRadius={999} bgcolor="#ED8E00"/>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body2"> — {allTranslations(localization.organizationAboutThereBlankFields)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        }
                    </Grid>
                </Box>

                <Box mb={5}>
                    <Tabs
                        value={tab}
                        className={classes.tabs}
                        onChange={(event, tab) => this.setState({tab})}
                        indicatorColor="primary"
                    >
                        {
                            forms.map((form, idx) => (
                                <Tab
                                    key={`tab-${idx}`}
                                    value={form.tab.value}
                                    label={<ChildrenTab form={form} isError={Boolean(errorTabs[form.tab.value])}/>}
                                />
                            ))
                        }
                    </Tabs>
                </Box>

                <Grid container justify="space-between">
                    <Grid item style={{flex: 1}}>
                        <Box>
                            <Formik
                                innerRef={setRef}
                                initialValues={organization?.legal?.info || {}}
                                validationSchema={validationSchema}

                                onSubmit={this.onSubmit}
                            >
                                {(props) => {
                                    const {values, errors, touched} = props;

                                    return (
                                        <Box maxWidth={770}>
                                            {
                                                forms.map((form, idx) => {
                                                    return (
                                                        <Box className={clsx({[classes.hidden]: form?.tab?.value !== tab})}>
                                                            <Grid container spacing={4}>
                                                                <Grid item xs={6}>
                                                                    {
                                                                        (form?.sections || []).map((section, idx) => {
                                                                            if (idx % 2 === 1) {
                                                                                return null
                                                                            }

                                                                            return (
                                                                                <Box mb={9}>
                                                                                    {
                                                                                        Boolean(!!section.title) && (
                                                                                            <Box mb={4}>
                                                                                                <Typography
                                                                                                    variant="h3">{section.title}</Typography>
                                                                                            </Box>
                                                                                        )
                                                                                    }
                                                                                    {
                                                                                        (section?.items || []).map((element, idx) => {
                                                                                            if (element.type === 'address') {
                                                                                                return (
                                                                                                    <Box mb={4}>
                                                                                                        <ComponentAddress
                                                                                                            value={values[element.name]}
                                                                                                            {...element}
                                                                                                            error={Boolean(errors[element.name])}
                                                                                                            helperText={errors[element.name]}
                                                                                                            onChange={this.onChangeForm}
                                                                                                            disabled={isGlobalDisabled}
                                                                                                        />
                                                                                                    </Box>
                                                                                                )
                                                                                            }
                                                                                            if (element.type === 'select') {
                                                                                                return (
                                                                                                    <Box mb={4}>
                                                                                                        <ComponentSelect
                                                                                                            value={values[element.name]}
                                                                                                            {...element}
                                                                                                            error={Boolean(errors[element.name])}
                                                                                                            helperText={errors[element.name]}
                                                                                                            onChange={this.onChangeForm}
                                                                                                            disabled={isGlobalDisabled}
                                                                                                        />
                                                                                                    </Box>
                                                                                                )
                                                                                            }
                                                                                            if (element.type === 'date') {
                                                                                                return (
                                                                                                    <Box mb={4}>
                                                                                                        <ComponentDate
                                                                                                            value={values[element.name]}
                                                                                                            {...element}
                                                                                                            error={Boolean(errors[element.name])}
                                                                                                            helperText={errors[element.name]}
                                                                                                            onChange={this.onChangeForm}
                                                                                                            disabled={isGlobalDisabled}
                                                                                                        />
                                                                                                    </Box>
                                                                                                )
                                                                                            }
                                                                                            if (element.type === 'phone') {
                                                                                                return (
                                                                                                    <Box mb={4}>
                                                                                                        <ComponentPhone
                                                                                                            value={values[element.name]}
                                                                                                            {...element}
                                                                                                            error={Boolean(errors[element.name])}
                                                                                                            helperText={errors[element.name]}
                                                                                                            onChange={this.onChangeForm}
                                                                                                            disabled={isGlobalDisabled}
                                                                                                        />
                                                                                                    </Box>
                                                                                                )
                                                                                            }
                                                                                            if (element.type === 'bank-card') {
                                                                                                return (
                                                                                                    <Box mb={4}>
                                                                                                        <ComponentBankCard/>
                                                                                                    </Box>
                                                                                                )
                                                                                            }

                                                                                            return (
                                                                                                <Box mb={4}>
                                                                                                    <ComponentInput
                                                                                                        value={values[element.name]}
                                                                                                        {...element}
                                                                                                        error={Boolean(errors[element.name])}
                                                                                                        helperText={errors[element.name]}
                                                                                                        onChange={this.onChangeForm}
                                                                                                        disabled={isGlobalDisabled}
                                                                                                    />
                                                                                                </Box>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </Box>
                                                                            )
                                                                        })
                                                                    }
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    {
                                                                        (form?.sections || []).map((section, idx) => {
                                                                            if (idx % 2 === 0) {
                                                                                return null
                                                                            }

                                                                            return (
                                                                                <Box mb={9}>
                                                                                    {
                                                                                        Boolean(!!section.title) && (
                                                                                            <Box mb={4}>
                                                                                                <Typography
                                                                                                    variant="h3">{section.title}</Typography>
                                                                                            </Box>
                                                                                        )
                                                                                    }
                                                                                    {
                                                                                        (section?.items || []).map((element, idx) => {
                                                                                            if (element.type === 'address') {
                                                                                                return (
                                                                                                    <Box mb={4}>
                                                                                                        <ComponentAddress
                                                                                                            value={values[element.name]}
                                                                                                            {...element}
                                                                                                            error={Boolean(errors[element.name])}
                                                                                                            helperText={errors[element.name]}
                                                                                                            onChange={this.onChangeForm}
                                                                                                            disabled={isGlobalDisabled}
                                                                                                        />
                                                                                                    </Box>
                                                                                                )
                                                                                            }
                                                                                            if (element.type === 'select') {
                                                                                                return (
                                                                                                    <Box mb={4}>
                                                                                                        <ComponentSelect
                                                                                                            value={values[element.name]}
                                                                                                            {...element}
                                                                                                            error={Boolean(errors[element.name])}
                                                                                                            helperText={errors[element.name]}
                                                                                                            onChange={this.onChangeForm}
                                                                                                            disabled={isGlobalDisabled}
                                                                                                        />
                                                                                                    </Box>
                                                                                                )
                                                                                            }
                                                                                            if (element.type === 'date') {
                                                                                                return (
                                                                                                    <Box mb={4}>
                                                                                                        <ComponentDate
                                                                                                            value={values[element.name]}
                                                                                                            {...element}
                                                                                                            error={Boolean(errors[element.name])}
                                                                                                            helperText={errors[element.name]}
                                                                                                            onChange={this.onChangeForm}
                                                                                                            disabled={isGlobalDisabled}
                                                                                                        />
                                                                                                    </Box>
                                                                                                )
                                                                                            }
                                                                                            if (element.type === 'phone') {
                                                                                                return (
                                                                                                    <Box mb={4}>
                                                                                                        <ComponentPhone
                                                                                                            value={values[element.name]}
                                                                                                            {...element}
                                                                                                            error={Boolean(errors[element.name])}
                                                                                                            helperText={errors[element.name]}
                                                                                                            onChange={this.onChangeForm}
                                                                                                            disabled={isGlobalDisabled}
                                                                                                        />
                                                                                                    </Box>
                                                                                                )
                                                                                            }
                                                                                            if (element.type === 'bank-card') {
                                                                                                return (
                                                                                                    <Box mb={4}>
                                                                                                        <ComponentBankCard/>
                                                                                                    </Box>
                                                                                                )
                                                                                            }

                                                                                            return (
                                                                                                <Box mb={4}>
                                                                                                    <ComponentInput
                                                                                                        value={values[element.name]}
                                                                                                        {...element}
                                                                                                        error={Boolean(errors[element.name])}
                                                                                                        helperText={errors[element.name]}
                                                                                                        onChange={this.onChangeForm}
                                                                                                        disabled={isGlobalDisabled}
                                                                                                    />
                                                                                                </Box>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </Box>
                                                                            )
                                                                        })
                                                                    }
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    )
                                                })
                                            }
                                        </Box>
                                    )
                                }}
                            </Formik>
                        </Box>
                    </Grid>
                    <Grid item>

                        {
                            Boolean(organizationDocuments?.application) && (
                                <Box mb={2} css={{border: "1px solid rgba(168, 171, 184, 0.6)"}} px={3} pt={2} pb={1} borderRadius={4} className={classes.buttonDownloadRequisites} onClick={() => this._openDocumentLink(organizationDocuments.application)}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M26.25 3.75H25.3125V2.8125C25.3125 1.26169 24.0508 0 22.5 0H3.75C2.19919 0 0.9375 1.26169 0.9375 2.8125V25.4375C0.9375 26.9883 2.19919 28.25 3.75 28.25H4.6875V29.1875C4.6875 30.7383 5.94919 32 7.5 32H26.25C27.8008 32 29.0625 30.7383 29.0625 29.1875V6.5625C29.0625 5.01169 27.8008 3.75 26.25 3.75ZM5.51125 7.22544C4.98 7.75663 4.6875 8.46287 4.6875 9.21412V26.375H3.75C3.23306 26.375 2.8125 25.9544 2.8125 25.4375V2.8125C2.8125 2.29556 3.23306 1.875 3.75 1.875H22.5C23.0169 1.875 23.4375 2.29556 23.4375 2.8125V3.75H10.1516C9.40037 3.75 8.69412 4.04256 8.16294 4.57375L5.51125 7.22544ZM10.3125 5.625V9.375H6.5625V9.21412C6.5625 8.96375 6.66 8.72831 6.83706 8.55125L9.48875 5.89956C9.66581 5.7225 9.90125 5.625 10.1516 5.625H10.3125ZM27.1875 29.1875C27.1875 29.7044 26.7669 30.125 26.25 30.125H7.5C6.98306 30.125 6.5625 29.7044 6.5625 29.1875V11.25H11.25C11.7677 11.25 12.1875 10.8302 12.1875 10.3125V5.625H26.25C26.7669 5.625 27.1875 6.04556 27.1875 6.5625V29.1875Z"/>
                                            </svg>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h5">Скачать "Анкету заявления"</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )
                        }

                        {
                            Boolean(organizationDocuments?.packetPaymentAct) && (
                                <Box mb={2} css={{border: "1px solid rgba(168, 171, 184, 0.6)"}} px={3} pt={2} pb={1} borderRadius={4} className={classes.buttonDownloadRequisites} onClick={() => this._openDocumentLink(organizationDocuments.packetPaymentAct)}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M26.25 3.75H25.3125V2.8125C25.3125 1.26169 24.0508 0 22.5 0H3.75C2.19919 0 0.9375 1.26169 0.9375 2.8125V25.4375C0.9375 26.9883 2.19919 28.25 3.75 28.25H4.6875V29.1875C4.6875 30.7383 5.94919 32 7.5 32H26.25C27.8008 32 29.0625 30.7383 29.0625 29.1875V6.5625C29.0625 5.01169 27.8008 3.75 26.25 3.75ZM5.51125 7.22544C4.98 7.75663 4.6875 8.46287 4.6875 9.21412V26.375H3.75C3.23306 26.375 2.8125 25.9544 2.8125 25.4375V2.8125C2.8125 2.29556 3.23306 1.875 3.75 1.875H22.5C23.0169 1.875 23.4375 2.29556 23.4375 2.8125V3.75H10.1516C9.40037 3.75 8.69412 4.04256 8.16294 4.57375L5.51125 7.22544ZM10.3125 5.625V9.375H6.5625V9.21412C6.5625 8.96375 6.66 8.72831 6.83706 8.55125L9.48875 5.89956C9.66581 5.7225 9.90125 5.625 10.1516 5.625H10.3125ZM27.1875 29.1875C27.1875 29.7044 26.7669 30.125 26.25 30.125H7.5C6.98306 30.125 6.5625 29.7044 6.5625 29.1875V11.25H11.25C11.7677 11.25 12.1875 10.8302 12.1875 10.3125V5.625H26.25C26.7669 5.625 27.1875 6.04556 27.1875 6.5625V29.1875Z"/>
                                            </svg>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h5">Скачать "Акт предоставления прав"</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )
                        }

                        {
                            Boolean(organizationDocuments?.treaty) && (
                                <Box mb={2} css={{border: "1px solid rgba(168, 171, 184, 0.6)"}} px={3} pt={2} pb={1} borderRadius={4} className={classes.buttonDownloadRequisites} onClick={() => this._openDocumentLink(organizationDocuments.treaty)}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M26.25 3.75H25.3125V2.8125C25.3125 1.26169 24.0508 0 22.5 0H3.75C2.19919 0 0.9375 1.26169 0.9375 2.8125V25.4375C0.9375 26.9883 2.19919 28.25 3.75 28.25H4.6875V29.1875C4.6875 30.7383 5.94919 32 7.5 32H26.25C27.8008 32 29.0625 30.7383 29.0625 29.1875V6.5625C29.0625 5.01169 27.8008 3.75 26.25 3.75ZM5.51125 7.22544C4.98 7.75663 4.6875 8.46287 4.6875 9.21412V26.375H3.75C3.23306 26.375 2.8125 25.9544 2.8125 25.4375V2.8125C2.8125 2.29556 3.23306 1.875 3.75 1.875H22.5C23.0169 1.875 23.4375 2.29556 23.4375 2.8125V3.75H10.1516C9.40037 3.75 8.69412 4.04256 8.16294 4.57375L5.51125 7.22544ZM10.3125 5.625V9.375H6.5625V9.21412C6.5625 8.96375 6.66 8.72831 6.83706 8.55125L9.48875 5.89956C9.66581 5.7225 9.90125 5.625 10.1516 5.625H10.3125ZM27.1875 29.1875C27.1875 29.7044 26.7669 30.125 26.25 30.125H7.5C6.98306 30.125 6.5625 29.7044 6.5625 29.1875V11.25H11.25C11.7677 11.25 12.1875 10.8302 12.1875 10.3125V5.625H26.25C26.7669 5.625 27.1875 6.04556 27.1875 6.5625V29.1875Z"/>
                                            </svg>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h5">Скачать "Договор"</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )
                        }

                        {
                            false && (
                                <Box css={{border: "1px solid rgba(168, 171, 184, 0.6)"}} px={3} pt={2} pb={1} borderRadius={4} className={classes.buttonDownloadRequisites} onClick={this.onDownloadRequisites}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M26.25 3.75H25.3125V2.8125C25.3125 1.26169 24.0508 0 22.5 0H3.75C2.19919 0 0.9375 1.26169 0.9375 2.8125V25.4375C0.9375 26.9883 2.19919 28.25 3.75 28.25H4.6875V29.1875C4.6875 30.7383 5.94919 32 7.5 32H26.25C27.8008 32 29.0625 30.7383 29.0625 29.1875V6.5625C29.0625 5.01169 27.8008 3.75 26.25 3.75ZM5.51125 7.22544C4.98 7.75663 4.6875 8.46287 4.6875 9.21412V26.375H3.75C3.23306 26.375 2.8125 25.9544 2.8125 25.4375V2.8125C2.8125 2.29556 3.23306 1.875 3.75 1.875H22.5C23.0169 1.875 23.4375 2.29556 23.4375 2.8125V3.75H10.1516C9.40037 3.75 8.69412 4.04256 8.16294 4.57375L5.51125 7.22544ZM10.3125 5.625V9.375H6.5625V9.21412C6.5625 8.96375 6.66 8.72831 6.83706 8.55125L9.48875 5.89956C9.66581 5.7225 9.90125 5.625 10.1516 5.625H10.3125ZM27.1875 29.1875C27.1875 29.7044 26.7669 30.125 26.25 30.125H7.5C6.98306 30.125 6.5625 29.7044 6.5625 29.1875V11.25H11.25C11.7677 11.25 12.1875 10.8302 12.1875 10.3125V5.625H26.25C26.7669 5.625 27.1875 6.04556 27.1875 6.5625V29.1875Z"/>
                                            </svg>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h5">{allTranslations(localization.commonDownloadRequisites)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )
                        }
                    </Grid>
                </Grid>

            </Box>
        )
    }
}

const ChildrenTab = (props) => {
    const {form, isError} = props;

    return (
        <div>
            {form.tab.label}

            {isError && (
                <Badge
                    variant="dot"
                    style={{marginTop: -30}}
                    children={(<div style={{width: 10, height: 10, borderRadius: 999, backgroundColor: "#ED8E00"}}/>)}
                />
            )}
        </div>
    )
}

const styles = {
    buttonDownloadRequisites: {
        boxShadow: "0 0 0 0 transparent",
        transition: "all 0.5s",
        cursor: "pointer",

        "& svg path": {
            fill: "#ED8E00",
            transition: "all 0.5s",
        },
        '&:hover': {
            boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.25)",

            "& svg path": {
                fill: "#8152E4",
            },
        }
    },

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
    },

    containerDadata: {
        border: '1px solid rgba(168, 171, 184, 0.5)',
        borderRadius: 5,
        padding: 32,
        maxWidth: 585
    },
    containerDadataTitle: {
        fontSize: 19,
        fontWeight: "500",
        lineHeight: '23px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#000000',
        marginBottom: 18
    },
    containerDadataCaption: {
        fontSize: 16,
        lineHeight: '19px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#999DB1',
        marginBottom: 24
    },

    buttonFormDadata: {
        height: 40,
        fontSize: 18
    }
};

export default withStyles(styles)(FormRequisites)
