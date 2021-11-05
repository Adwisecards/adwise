import React, {useState, useRef} from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    InputAdornment,
    Link,
    Grid,
} from '@material-ui/core';

import {ShowPassword as ShowPasswordIcon, HidePassword} from '../../../../../icons'
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const initialForm = {
    login: '',
    password: ''
};
const validationSchema = Yup.object().shape({
    login: Yup.string().max(255).required(allTranslations(localization.yupValidationRequired)),
    password: Yup.string().max(255).required(allTranslations(localization.yupValidationRequired))
});

const Form = (props) => {
    const {onLogin, isSubmitForm, onLoginWiseWin} = props;
    const [showPassword, setShowPassword] = useState(false)
    const refForm = useRef();

    const handleSubmit = (form, events) => {
        onLogin(form, events)
    }
    const handleOnChange = (event) => {
        const target = event.target;

        const name = target.name;
        const value = target.value;

        refForm.current.setFieldValue(name, value);
    }

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev)
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
                        <Box mt={3}>
                            <Typography variant={'formTitle'}>{allTranslations(localization.authorizationFormEmail)}</Typography>
                            <TextField
                                fullWidth
                                error={Boolean(touched.login && errors.login)}
                                helperText={touched.login && errors.login}
                                margin="normal"
                                name="login"
                                value={values.login}
                                variant="outlined"
                                onChange={handleOnChange}
                            />
                        </Box>
                        <Box mt={3}>
                            <Typography variant={'formTitle'}>{allTranslations(localization.authorizationFormPassword)}</Typography>

                            <TextField
                                fullWidth
                                error={Boolean(touched.password && errors.password)}
                                helperText={touched.password && errors.password}
                                margin="normal"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                variant="outlined"
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <HidePassword/> : <ShowPasswordIcon/>}
                                            </IconButton>
                                        </InputAdornment>,
                                }}
                                onChange={handleOnChange}
                            />

                        </Box>

                        <Box mt={3}>

                            <Typography
                                variant="body1"
                                dangerouslySetInnerHTML={{
                                    __html: `${allTranslations(localization.authorizationPrivacyWord1)} <a href="/privacy-policy" class="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary" target="_blank">${allTranslations(localization.authorizationPrivacyWord2)}</a>, <a href="/user-agreement" class="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary" target="_blank">${allTranslations(localization.authorizationPrivacyWord3)}</a> ${allTranslations(localization.authorizationPrivacyWord4)}`
                                }}
                            />
                        </Box>

                        <Box mt={4}>
                            <Button
                                onClick={handleSubmit}
                                variant={'contained'}

                                disabled={isSubmitForm}
                            >
                                {allTranslations(localization.authorizationButtonsAuthorization)}
                            </Button>

                            <Button
                                onClick={onLoginWiseWin}
                                variant={'outlined'}

                                disabled={isSubmitForm}

                                style={{marginLeft: 8}}
                            >
                                {allTranslations(localization.authorizationButtonsWiseWin)}
                            </Button>
                        </Box>
                    </form>
                )
            }}
        </Formik>
    )
        ;
}

export default Form;
