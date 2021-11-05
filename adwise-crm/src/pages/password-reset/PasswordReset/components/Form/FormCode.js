import React, {useRef} from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {
    Box,
    Button,
    makeStyles,
    Typography,
    TextField,
    Grid
} from '@material-ui/core';
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const initialForm = {
    code: ''
};
const validationSchema = Yup.object().shape({
    code: Yup.string().required(allTranslations(localization.yupValidationRequired))
});

const FormCode = (props) => {
    const {onPasswordReset, isSubmitForm, goBack} = props;
    const refForm = useRef();

    const handleSubmit = (form, events) => {
        onPasswordReset(form, events)
    }
    const handleOnChange = (event) => {
        const target = event.target;

        const name = target.name;
        const value = target.value;

        refForm.current.setFieldValue(name, value);
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
                  values,
                isValid

              }) => {
                return (
                    <form onSubmit={handleSubmit}>
                        <Box mt={3}>
                            <Typography variant={'formTitle'}>{allTranslations(localization.resetPasswordCode)}</Typography>
                            <TextField
                                fullWidth
                                error={Boolean(touched.code && errors.code)}
                                helperText={touched.code && errors.code}
                                margin="normal"
                                name="code"
                                value={values.code}
                                variant="outlined"
                                onChange={handleOnChange}
                            />
                        </Box>
                        <Box mt={3}>
                            <Grid container spacing={1}>

                                <Grid item>
                                    <Button
                                        onClick={handleSubmit}
                                        variant={'contained'}

                                        disabled={!isValid || !values.code}
                                    >
                                        {allTranslations(localization.resetPasswordButtonSend)}
                                    </Button>
                                </Grid>

                                <Grid item>
                                    <Button
                                        onClick={goBack}
                                        variant="outlined"
                                    >
                                        {allTranslations(localization.resetPasswordButtonRepeat)}
                                    </Button>
                                </Grid>

                            </Grid>
                        </Box>
                    </form>
                )
            }}
        </Formik>
    );
}

export default FormCode;
