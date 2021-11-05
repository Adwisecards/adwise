import React, {useState, useRef} from "react";
import {
    Box,

    Typography,

    TextField,

    Button
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import * as Yup from "yup";
import {Formik} from "formik";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const validationSchema = Yup.object().shape({
    email: Yup
        .string()
        .required(allTranslations(localization.yupValidationRequired))
        .email(allTranslations(localization.yupValidationEmail))
});

const InvoiceRequestForm = (props) => {
    const { sendFormEmail, account } = props;

    const classes = useStyles();

    const [form, setForm] = useState({
        email: account.email
    });

    const refForm = useRef(null);

    const handleOnChange = ({target}) => {
        const value = target.value;
        const name = target.name;

        let newForm = {...form};
        newForm[name] = value;

        setForm(newForm);
        refForm.current.setValues(newForm);
    }
    const handleSubmit = (form, event) => {
        sendFormEmail(form, event);
    }

    return (
        <Box>

            <Typography className={classes.title}>{allTranslations(localization.tariffInvoiceRequestFormTitle)}</Typography>

            <Typography
                className={classes.description}
                dangerouslySetInnerHTML={{__html: allTranslations(localization.tariffInvoiceRequestFormMessage)}}
            />

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
                      handleBlur,
                      touched,
                      values
                  }) => {
                    return (
                        <>
                            <Box>
                                <TextField
                                    fullWidth
                                    error={Boolean(touched.email && errors.email)}
                                    helperText={touched.email && errors.email}
                                    placeholder={"info@wise.win"}
                                    name="email"
                                    value={values.email}
                                    variant="outlined"
                                    onChange={handleOnChange}
                                    onBlur={handleBlur}
                                    className={classes.input}
                                />
                            </Box>

                            <Button
                                variant="contained"
                                className={classes.button}

                                onClick={handleSubmit}
                            >{allTranslations(localization.tariffInvoiceRequestFormButton)}</Button>

                        </>
                    )
                }}
            </Formik>

        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 20,
        lineHeight: '24px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: 8
    },
    description: {
        fontSize: 16,
        lineHeight: '19px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        color: '#999DB1',

        marginBottom: 24
    },
    input: {
        maxWidth: 360,

        marginBottom: 32
    },
    button: {
        padding: '3px 22px',

        fontSize: 18,
        lineHeight: '36px',

        textTransform: 'initial'
    },
}))

export default InvoiceRequestForm
