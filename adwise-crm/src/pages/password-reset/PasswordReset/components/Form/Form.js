import React, {useRef} from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {
    Box,
    Button,
    makeStyles,
    Typography,
    TextField,
} from '@material-ui/core';
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const initialForm = {
    email: ''
};
const validationSchema = Yup.object().shape({
    email: Yup.string().email(allTranslations(localization.yupValidationEmail)).max(255).required(localization.yupValidationRequired)
});

const Form = (props) => {
    const {onPasswordReset, isSubmitForm} = props;
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
                            <Typography variant={'formTitle'}>{allTranslations(localization.resetPasswordEmail)}</Typography>
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
                        </Box>
                        <Box mt={3}>
                            <Button
                                onClick={handleSubmit}
                                variant={'contained'}

                                disabled={!isValid || !values.email}
                            >
                                {allTranslations(localization.resetPasswordButtonReset)}
                            </Button>
                        </Box>
                    </form>
                )
            }}
        </Formik>
    );
}

export default Form;
