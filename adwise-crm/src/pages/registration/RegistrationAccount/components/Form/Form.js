import React, {useRef, useState} from 'react';
import {
    Box,
    Grid,
    Button,
    TextField,
    Typography,

    Checkbox,
    FormControlLabel,
    FormHelperText,

    Link
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import * as Yup from "yup";
import {Formik} from "formik";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const initialForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',

    isPrivacyPolicy: false,
    isTermsOffer: false
};
const validationSchema = Yup.object().shape({
    firstName: Yup.string().max(255).required(allTranslations(localization.yupValidationRequired)),
    email: Yup.string(allTranslations(localization.yupValidationString)).required(allTranslations(localization.yupValidationRequired)).email(allTranslations(localization.yupValidationEmail)),

    password: Yup.string().required(allTranslations(localization.yupValidationRequired)).typeError(allTranslations(localization.yupValidationString)).min(6, allTranslations(localization.registrationErrorsPasswordLength)),
    confirmPassword: Yup.string().required(allTranslations(localization.yupValidationRequired)).typeError(allTranslations(localization.yupValidationString)).oneOf([Yup.ref('password')], allTranslations(localization.registrationErrorsPasswordRepeat)).min(6, allTranslations(localization.registrationErrorsPasswordLength)),

    isPrivacyPolicy: Yup.boolean().oneOf([true], allTranslations(localization.registrationErrorsPrivacyPolicy)),
    isTermsOffer: Yup.boolean().oneOf([true], allTranslations(localization.registrationErrorsTermsOffer))
});

const Form = (props) => {
    const { onCreateUser, isProcessingCreateUser } = props;
    const refForm = useRef();

    const handleSubmit = (initForm, event) => {
        const form = {...initForm};

        delete form['isPrivacyPolicy'];
        delete form['isTermsOffer'];

        onCreateUser(form, event)
    }
    const handleOnChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        refForm.current.setFieldValue(name, value)
    }

    const handleOnChangeCheckbox = (event, value) => {
        const target = event.target;
        const name = target.name;

        refForm.current.setFieldValue(name, value)
    }

    return (
        <Formik
            innerRef={refForm}

            initialValues={initialForm}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({
                  errors,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values
              }) => {
                return (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} xs={12}>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Typography variant={'formTitle'}>{allTranslations(localization.registrationFormName)}</Typography>
                                        <TextField
                                            fullWidth
                                            error={Boolean(touched.firstName && errors.firstName)}
                                            helperText={touched.firstName && errors.firstName}
                                            margin="normal"
                                            name="firstName"
                                            value={values.firstName}
                                            variant="outlined"
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant={'formTitle'}>{allTranslations(localization.registrationFormLastName)}</Typography>
                                        <TextField
                                            fullWidth
                                            error={Boolean(touched.lastName && errors.lastName)}
                                            helperText={touched.lastName && errors.lastName}
                                            margin="normal"
                                            name="lastName"
                                            value={values.lastName}
                                            variant="outlined"

                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography variant={'formTitle'}>{allTranslations(localization.registrationFormEmail)}</Typography>
                                        <TextField
                                            fullWidth
                                            error={Boolean(touched.email && errors.email)}
                                            helperText={touched.email && errors.email}
                                            margin="normal"
                                            name="email"
                                            value={values.email}
                                            variant="outlined"

                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Typography variant={'formTitle'}>{allTranslations(localization.registrationFormPassword)}</Typography>
                                        <TextField
                                            fullWidth
                                            error={Boolean(touched.password && errors.password)}
                                            helperText={touched.password && errors.password}
                                            margin="normal"
                                            name="password"
                                            type="password"
                                            value={values.password}
                                            variant="outlined"

                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant={'formTitle'}>{allTranslations(localization.registrationFormPasswordRepeat)}</Typography>
                                        <TextField
                                            fullWidth
                                            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                            helperText={touched.confirmPassword && errors.confirmPassword}
                                            margin="normal"
                                            name="confirmPassword"
                                            type="password"
                                            value={values.confirmPassword}
                                            variant="outlined"

                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox checked={values.isPrivacyPolicy} name="isPrivacyPolicy" onChange={(event) => handleOnChangeCheckbox(event, !values.isPrivacyPolicy)}/>}
                                    value={values.isPrivacyPolicy}
                                    label={(<span>{allTranslations(localization.registrationPrivacyPolicyWord1)} <Link href="/privacy-policy" target={'_blank'}>{allTranslations(localization.registrationPrivacyPolicyWord2)}</Link> {allTranslations(localization.registrationPrivacyPolicyWord3)}</span>)}
                                />
                                {(touched.isPrivacyPolicy && errors.isPrivacyPolicy) && <FormHelperText error>{errors.isPrivacyPolicy}</FormHelperText>}

                                <FormControlLabel
                                    control={<Checkbox checked={values.isTermsOffer} name="isTermsOffer" onChange={(event) => handleOnChangeCheckbox(event, !values.isTermsOffer)}/>}
                                    value={values.isTermsOffer}
                                    label={(<span>{allTranslations(localization.registrationTermsOfferWord1)} <Link href="/user-agreement" target={'_blank'}>{allTranslations(localization.registrationTermsOfferWord2)}</Link></span>)}
                                />
                                {(touched.isTermsOffer && errors.isTermsOffer) && <FormHelperText error>{errors.isTermsOffer}</FormHelperText>}
                            </Grid>
                        </Grid>

                        <Box mt={8}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={isProcessingCreateUser}
                            >
                                {allTranslations(localization.registrationButtonsContinueRegistration)}
                            </Button>
                        </Box>
                    </form>
                )
            }}
        </Formik>
    )
}

const useStyle = makeStyles(() => ({}));

export default Form
