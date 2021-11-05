import React from "react";
import {
    Box,
    Grid,

} from "@material-ui/core";
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
    Select as SelectComponent,
    TextField as TextFieldComponent,
    TextEditor as TextEditorComponent,
    MobileDisplayExample as MobileDisplayExampleComponent
} from "../../components";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import MyRegexp from "myregexp";

const Organization = (props) => {
    const { innerRef, isCreated, onSubmit, onChange } = props;

    const handleOnChange = ({ target }) => {
        const { value, name } = target;
        let newForm = innerRef.current?.values || {};
        newForm[name] = value;
        onChange(newForm);
    }

    const _legalList = () => {
        return [
            {
                label: allTranslations(localization.documentTypesIndividual),
                value: 'individual'
            },
            {
                label: allTranslations(localization.documentTypesIp),
                value: 'ip'
            },
            {
                label: allTranslations(localization.documentTypesOoo),
                value: 'ooo'
            }
        ]
    }

    return (
        <Formik
            innerRef={innerRef}
            initialValues={{}}
            validationSchema={isCreated ? validationSchema : validationSchemaEdit}
            onSubmit={onSubmit}
        >
            {(props) => {
                const { values, errors, touched, handleSubmit } = props;

                console.log('values: ', values);
                console.log('errors: ', errors);

                return (
                    <>

                        <Grid container spacing={8}>

                            <Grid item lg={8} xs={12}>
                                <Grid container spacing={8}>
                                    <Grid item lg={6} xs={12}>

                                        <Box mb={5}>
                                            <TextFieldComponent
                                                label={allTranslations(localization.organizationAboutFormsName)}

                                                name="name"
                                                value={values.name}
                                                placeholder={allTranslations(localization.organizationAboutPlaceholdersName)}
                                                error={Boolean(touched.name && errors.name)}
                                                helperText={
                                                    touched.name && errors.name
                                                        ? touched.name && errors.name
                                                        : allTranslations(localization.organizationAboutIndicatedWithoutLegalForm)
                                                }
                                                onChange={handleOnChange}
                                            />
                                        </Box>

                                        <Box mb={5}>
                                            <SelectComponent
                                                label={allTranslations(localization.organizationAboutFormsLegalForm)}

                                                name="legal.form"
                                                value={values['legal.form']}
                                                error={Boolean(touched['legal.form'] && errors['legal.form'])}
                                                helperText={touched['legal.form'] && errors['legal.form']}
                                                onChange={handleOnChange}
                                                options={_legalList()}
                                            />
                                        </Box>

                                        <Box mb={5}>
                                            <TextFieldComponent
                                                label={allTranslations(localization.organizationAboutFormsBriefDescription)}

                                                name="briefDescription"
                                                value={values.briefDescription}
                                                placeholder={allTranslations(localization.organizationAboutPlaceholdersName)}
                                                error={Boolean(touched.briefDescription && errors.briefDescription)}
                                                helperText={allTranslations(localization.organizationAboutDescribeActivitiesYourCompany)}
                                                onChange={handleOnChange}
                                                rowsMax={4}
                                                rows={2}
                                                multiline
                                            />
                                        </Box>

                                        <Box mb={5}>
                                            <TextEditorComponent
                                                label={allTranslations(localization.organizationAboutFormsDescription)}

                                                name="briefDescription"
                                                value={values.briefDescription}
                                                placeholder={allTranslations(localization.organizationAboutPlaceholdersName)}
                                                error={Boolean(touched.briefDescription && errors.briefDescription)}
                                                helperText={allTranslations(localization.organizationAboutDescribeActivitiesYourCompany)}
                                                onChange={handleOnChange}
                                                rowsMax={4}
                                                rows={2}
                                                multiline
                                            />
                                        </Box>

                                    </Grid>

                                    <Grid item lg={6} xs={12}></Grid>
                                </Grid>
                            </Grid>

                            <Grid item lg={3} xs={12}></Grid>

                        </Grid>

                    </>
                )
            }}
        </Formik>
    )
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
    phones: Yup.array().min(1, allTranslations(localization.organizationAboutErrorsMinPhone)).of(Yup.string().matches(MyRegexp.phone(), allTranslations(localization.organizationAboutErrorsErrorPhone))),
    emails: Yup.array().min(0).of(Yup.string().email(allTranslations(localization.yupValidationEmail)))
});

export default Organization
