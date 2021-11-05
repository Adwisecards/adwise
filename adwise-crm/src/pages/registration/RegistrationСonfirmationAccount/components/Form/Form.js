import React, {useRef, useState} from 'react';
import {
    Box,
    Grid,
    Button,
    TextField,
    Typography,

    Checkbox,
    FormControlLabel,
    FormHelperText
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import * as Yup from "yup";
import {Formik} from "formik";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const validationSchema = Yup.object().shape({
    confirmationCode: Yup.string().required(allTranslations(localization.yupValidationString))
});

const Form = (props) => {
    const { form, onСonfirmationUser, isProcessingCreateUser } = props;
    const refForm = useRef();

    const handleSubmit = (initForm, event) => {
        const form = {...initForm};

        onСonfirmationUser(form, event)
    }
    const handleOnChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        refForm.current.setFieldValue(name, value)
    }

    return (
        <Formik
            innerRef={refForm}

            initialValues={form}
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
                                    <Grid item xs={12}>
                                        <Typography variant={'formTitle'}>{allTranslations(localization.registrationConfirmationCode)}</Typography>
                                        <TextField
                                            fullWidth
                                            error={Boolean(touched.confirmationCode && errors.confirmationCode)}
                                            helperText={touched.confirmationCode && errors.confirmationCode}
                                            margin="normal"
                                            name="confirmationCode"
                                            placeholder={"0000"}
                                            value={values.confirmationCode}
                                            variant="outlined"

                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Box mt={8}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={isProcessingCreateUser}
                            >
                                {allTranslations(localization.registrationConfirmationButton)}
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
