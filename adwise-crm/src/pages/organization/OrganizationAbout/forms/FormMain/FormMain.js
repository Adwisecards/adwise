import React, {useRef, useState, useEffect} from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    InputAdornment,
} from '@material-ui/core';
import {} from '@material-ui/styles';
import {Autocomplete} from '@material-ui/lab';
import {TextEditor, AddressAutocomplete} from '../../../../../components';
import {LegalForm, PhoneMultiple, EmailsMultiple, TariffsSelect} from '../../components';
import * as Yup from 'yup';
import {Formik} from 'formik';
import MyRegexp from 'myregexp';
import axiosInstance from '../../../../../agent/agent';
import urls from '../../../../../constants/urls';

import formIndividual from '../../../../../legalForms/forms/individual';
import formIp from '../../../../../legalForms/forms/ip';
import formOoo from '../../../../../legalForms/forms/ooo';
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const legalForm = {
    individual: formIndividual,
    ip: formIp,
    ooo: formOoo,
}


const validationSchema = Yup.object().shape({
    name: Yup.string().max(255).required(allTranslations(localization.yupValidationRequired)),
    packet: Yup.string().required(allTranslations(localization.yupValidationRequired)).nullable(),
    placeId: Yup.string().max(255).required(allTranslations(localization.yupValidationRequired)).nullable(allTranslations(localization.organizationAboutErrorsPlaceId)),
    description: Yup.string().required(allTranslations(localization.yupValidationRequired)),
    briefDescription: Yup.string().max(350, allTranslations(localization.yupValidationMax, {count: 350})).required(allTranslations(localization.yupValidationRequired)),
    website: Yup.string().matches(/^((ftp|http|https):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/, allTranslations(localization.organizationAboutErrorsWebsite)),
    phones: Yup.array().min(1, allTranslations(localization.organizationAboutErrorsMinPhone)).of(Yup.string().matches(MyRegexp.phone(), allTranslations(localization.organizationAboutErrorsErrorPhone))),
    emails: Yup.array().min(0).of(Yup.string().email(allTranslations(localization.yupValidationEmail)))
});
const validationSchemaEdit = Yup.object().shape({
    name: Yup.string().max(255).required(allTranslations(localization.yupValidationRequired)),
    placeId: Yup.string().max(255).required(allTranslations(localization.yupValidationRequired)).nullable(allTranslations(localization.organizationAboutErrorsPlaceId)),
    description: Yup.string().required(allTranslations(localization.yupValidationRequired)),
    briefDescription: Yup.string().max(350, allTranslations(localization.yupValidationMax, {count: 350})).required(allTranslations(localization.yupValidationRequired)),
    website: Yup.string().matches(/^((ftp|http|https):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/, allTranslations(localization.organizationAboutErrorsWebsite)),
    phones: Yup.array()
        .min(1, allTranslations(localization.organizationAboutErrorsMinPhone))
        .of(Yup.string().matches(MyRegexp.phone(), allTranslations(localization.organizationAboutErrorsErrorPhone))),
    emails: Yup.array().min(0).of(Yup.string().email(allTranslations(localization.yupValidationEmail)))
});

let searchAddressTiming;

const FormMain = (props) => {
    const {
        setRef,
        packets,
        isCreated,
        organization,
        refRequisites,
        wiseWinPacket,
        countryLegalForms,
        onChangeOrganization,
        isGlobalDisabled,
        onOpenAddress
    } = props;
    const handleSubmit = () => {
    };
    const handleOnChange = (event, maxLength = null) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        if (maxLength && value.length >= maxLength) {
            return null
        }

        let newOrganization = {...organization};
        newOrganization[name] = value;

        onChangeOrganization(newOrganization);
    };
    const handleOnChangePhones = (phones) => {
        let newOrganization = {...organization};

        newOrganization['phones'] = phones;

        onChangeOrganization(newOrganization);
    };
    const handleOnChangeEmails = (emails) => {
        let newOrganization = {...organization};

        newOrganization['emails'] = emails;

        onChangeOrganization(newOrganization);
    };
    const handleOnChangeTextEditor = (value) => {
        let newOrganization = {...organization};
        newOrganization['description'] = value;

        onChangeOrganization(newOrganization);
    };

    const handleChangeLegal = (value) => {
        let newOrganization = {...organization};
        newOrganization['legal']['form'] = value;
        newOrganization['legal']['info'] = getLegalNewForm(value);

        refRequisites.onChangeLegalForm(value);
        onChangeOrganization(newOrganization);
    };
    const getLegalNewForm = (type) => {
        let form = {};
        const legalInitialForm = legalForm[type];

        legalInitialForm.map((item) => {
            item.sections.map((section) => {
                section.items.map((item) => {
                    form[item.name] = "";
                })
            })
        })

        return form;
    };

    return (
        <Formik
            innerRef={setRef}
            initialValues={organization}
            validationSchema={isCreated ? validationSchema : validationSchemaEdit}
            onSubmit={handleSubmit}
        >
            {({
                  errors,
                  handleSubmit,
                  isSubmitting,
                  handleBlur,
                  touched,
                  values,
              }) => {
                const legal = values?.legal || {};
                const packet = values?.packet || null;
                let {info} = legal;

                if (!info) {
                    info = {};
                }

                return (
                    <>
                        <Box mb={5}>
                            <Typography variant='formTitle'>{allTranslations(localization.organizationAboutFormsName)}</Typography>

                            <TextField
                                fullWidth
                                error={Boolean(touched.name && errors.name)}
                                helperText={
                                    touched.name && errors.name
                                        ? touched.name && errors.name
                                        : allTranslations(localization.organizationAboutIndicatedWithoutLegalForm)
                                }
                                placeholder={allTranslations(localization.organizationAboutPlaceholdersName)}
                                margin='normal'
                                name='name'
                                value={values.name}
                                variant='outlined'
                                onChange={handleOnChange}
                                onBlur={handleBlur}
                                disabled={isGlobalDisabled}
                            />
                        </Box>

                        <Box mb={5}>
                            <Typography variant='formTitle'>{allTranslations(localization.organizationAboutFormsLegalForm)}</Typography>

                            <LegalForm
                                value={legal.form}
                                countryLegalForms={countryLegalForms}
                                onChangeLegal={handleChangeLegal}
                                disabled={isGlobalDisabled}
                                {...props}
                            />
                        </Box>

                        {
                            (isCreated) && (
                                <Box mb={5}>
                                    <Typography variant='formTitle'>Тариф</Typography>

                                    <TariffsSelect
                                        activePacket={packet}
                                        value={packet?._id || packet || ""}
                                        packets={packets}
                                        name="packet"
                                        wiseWinPacket={wiseWinPacket}
                                        disabled={isGlobalDisabled}
                                        error={Boolean(touched.packet && errors.packet)}
                                        helperText={touched.packet && errors.packet}
                                        onChange={handleOnChange}
                                    />
                                </Box>
                            )
                        }

                        <Box mb={5}>
                            <Typography variant='formTitle'>{allTranslations(localization.organizationAboutFormsBriefDescription)}</Typography>

                            <TextField
                                fullWidth
                                error={Boolean(
                                    touched.briefDescription && errors.briefDescription
                                )}
                                helperText={allTranslations(localization.organizationAboutDescribeActivitiesYourCompany)}
                                margin='normal'
                                placeholder={allTranslations(localization.organizationAboutPlaceholdersBriefDescription)}
                                name='briefDescription'
                                value={values.briefDescription}
                                variant='outlined'
                                onChange={(event) => handleOnChange(event, 350)}
                                onBlur={handleBlur}
                                rows={2}
                                rowsMax={4}
                                multiline
                            />
                        </Box>

                        <Box mb={5}>
                            <Typography variant='formTitle'>{allTranslations(localization.organizationAboutFormsDescription)}</Typography>

                            <TextEditor
                                value={values.description}
                                name='description'
                                error={Boolean(touched.description && errors.description)}
                                helperText={touched.description && errors.description}
                                onChange={handleOnChangeTextEditor}
                            />
                        </Box>

                        <Box mb={2}>
                            <Typography variant='formTitle'>{allTranslations(localization.organizationAboutFormsAddressId)}</Typography>

                            <AddressAutocomplete
                                name="placeId"
                                value={values?.placeId || ''}
                                disabled={isGlobalDisabled}

                                error={Boolean(touched.placeId && errors.placeId)}
                                helperText={touched.placeId && errors.placeId}

                                onChange={handleOnChange}
                            />

                            <Button variant="contained" color="secondary" onClick={onOpenAddress} size="small" style={{height: 30}} fullWidth>
                                Указать дополнительные данные
                            </Button>

                        </Box>

                        <Box mb={5}>
                            <Typography variant='formTitle'>{allTranslations(localization.organizationAboutFormsWebsite)}</Typography>

                            <label>
                                <TextField
                                    name={'website'}
                                    margin={'normal'}
                                    variant={'outlined'}
                                    placeholder={'crm.adwise.cards'}
                                    value={values.website}
                                    error={Boolean(touched.website && errors.website)}
                                    helperText={touched.website && errors.website}
                                    fullWidth
                                    onChange={handleOnChange}
                                />
                            </label>
                        </Box>

                        <Box mb={5}>
                            <PhoneMultiple
                                organization={organization}
                                onChange={handleOnChangePhones}
                                error={touched.phones && errors.phones}
                            />
                        </Box>

                        <Box mb={5}>
                            <EmailsMultiple
                                organization={organization}
                                onChange={handleOnChangeEmails}
                                error={touched.emails && errors.emails}
                            />
                        </Box>
                    </>
                );
            }}
        </Formik>
    );
};

export default FormMain;
