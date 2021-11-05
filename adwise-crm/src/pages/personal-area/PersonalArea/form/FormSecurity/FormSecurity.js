import React, {
    useRef,
    useState,
    useEffect
} from "react";
import {
    Box,

    TextField,

    Typography,

    Button,

    CircularProgress, Backdrop,

    IconButton,
    InputAdornment,
} from '@material-ui/core';
import {} from '@material-ui/styles';
import * as Yup from "yup";
import {Formik} from "formik";
import axiosInstance from "../../../../../agent/agent";
import urls from "../../../../../constants/urls";
import {store} from "react-notifications-component";
import getErrorMessage from "../../../../../helper/getErrorMessage";

import {ShowPassword as ShowPasswordIcon, HidePassword} from '../../../../../icons'
import alertNotification from "../../../../../common/alertNotification";

const validationSchema = Yup.object().shape({
    password: Yup.string().required('Заполните поле').typeError('Должна быть строка').min(6, 'Пароль должен быть больше 6 символов'),
    confirmPassword: Yup.string().required('Заполните поле').typeError('Должна быть строка').oneOf([Yup.ref('password')], 'Пароли не совпадают').min(6, 'Пароль должен быть больше 6 символов'),
    // oldPassword: Yup.string().required('Заполните поле').typeError('Должна быть строка').min(6, 'Пароль должен быть больше 6 символов'),
});

const initForm = {
    password: '',
    confirmPassword: '',
    oldPassword: ''
};

const FormSecurity = (props) => {
    const {onChange, account} = props;
    const [showPassword, setShowPassword] = useState(
        {
            oldPassword: false,
            password: false,
            confirmPassword: false
        })

    const [isSubmit, setSubmit] = useState(false);

    const refForm = useRef();

    const handleClickShowPassword = (name) => {
        setShowPassword(prevState => ({
            ...prevState,
            [name]: !prevState[name]
        }))
    }

    const handleSubmit = (form, event) => {
        setSubmit(true);

        let body = {...account};

        body['password'] = form.password

        axiosInstance.put(`${urls["update-user"]}`, body).then((response) => {

            alertNotification({
                title: 'Успешно',
                message: 'Пароль успешно изменён',
                type: 'success',
            })

            setSubmit(false);
        }).catch(error => {
            const errorMessage = getErrorMessage(error);
            setSubmit(false);

            alertNotification({
                title: errorMessage.title,
                message: errorMessage.message,
                type: 'danger',
            })

        })
    }

    const handleOnChange = ({target}) => {
        const name = target.name;
        const value = target.value;

        let newInitForm = {...initForm};
        initForm[name] = value;

        refForm.current.setValues(initForm);
    }

    return (
        <>
            <Formik
                innerRef={refForm}

                initialValues={initForm}
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
                            {/*<Box mb={4}>*/}
                            {/*    <Typography variant="formTitle">Старый пароль</Typography>*/}

                            {/*    <TextField*/}
                            {/*        fullWidth*/}
                            {/*        error={Boolean(touched.oldPassword && errors.oldPassword)}*/}
                            {/*        helperText={touched.oldPassword && errors.oldPassword}*/}
                            {/*        placeholder={"******"}*/}
                            {/*        margin="normal"*/}
                            {/*        type={showPassword.oldPassword ? 'text': 'password'}*/}
                            {/*        name="oldPassword"*/}
                            {/*        value={values.oldPassword}*/}
                            {/*        variant="outlined"*/}
                            {/*        onChange={handleOnChange}*/}
                            {/*        onBlur={handleBlur}*/}
                            {/*        InputProps={{*/}
                            {/*            endAdornment:*/}
                            {/*            <InputAdornment position="end">*/}
                            {/*                <IconButton*/}
                            {/*                    aria-label="toggle password visibility"*/}
                            {/*                    onClick={() => handleClickShowPassword("oldPassword")}*/}
                            {/*                    edge="end"*/}
                            {/*                    >*/}
                            {/*                {showPassword.oldPassword ?  <HidePassword /> :  <ShowPasswordIcon />}*/}
                            {/*                </IconButton>*/}
                            {/*            </InputAdornment>,*/}
                            {/*          }}*/}
                            {/*    />*/}
                            {/*</Box>*/}

                            <Box mb={4}>
                                <Typography variant="formTitle">Новый пароль</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.password && errors.password)}
                                    helperText={touched.password && errors.password}
                                    placeholder={"******"}
                                    margin="normal"
                                    type={showPassword.password ? 'text': 'password'}
                                    name="password"
                                    value={values.password}
                                    variant="outlined"
                                    onChange={handleOnChange}
                                    onBlur={handleBlur}
                                    InputProps={{
                                        endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => handleClickShowPassword("password")}
                                                edge="end"
                                                >
                                            {showPassword.password?  <HidePassword /> :  <ShowPasswordIcon />}
                                            </IconButton>
                                        </InputAdornment>,
                                      }}
                                />
                            </Box>

                            <Box mb={4}>
                                <Typography variant="formTitle">Изменить пароль</Typography>

                                <TextField
                                    fullWidth
                                    placeholder={"******"}
                                    margin="normal"
                                    type={showPassword.confirmPassword ? 'text': 'password'}
                                    name="confirmPassword"
                                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                    helperText={touched.confirmPassword && errors.confirmPassword}
                                    value={values.confirmPassword}
                                    variant="outlined"
                                    onChange={handleOnChange}
                                    onBlur={handleBlur}
                                    InputProps={{
                                        endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => handleClickShowPassword("confirmPassword")}
                                                edge="end"
                                                >
                                            {showPassword.confirmPassword ?  <HidePassword /> :  <ShowPasswordIcon />}
                                            </IconButton>
                                        </InputAdornment>,
                                      }}
                                />
                            </Box>

                            <Box>
                                <Button variant="outlined" size="small" onClick={handleSubmit}>Изменить пароль</Button>
                            </Box>
                        </>
                    )
                }}
            </Formik>
            <Backdrop open={isSubmit} invisible={isSubmit}>
                <CircularProgress size={80} style={{color: 'white'}}/>
            </Backdrop>
        </>
    )
}

export default FormSecurity
