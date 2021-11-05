import React, {useState} from "react";
import {
    Box,

    Typography,

    TextField,
    InputAdornment,

    Button,
    IconButton,

} from "@material-ui/core";
import {} from "@material-ui/styles";
import {Formik} from 'formik';
import {
    Eye as EyeIcon,
    EyeOff as EyeOffIcon
} from "react-feather";

import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    login: Yup.string().max(255).required('Заполните поле'),
    password: Yup.string().max(255).required('Заполните поле')
});

const FormAuthorization = (props) => {
    const {form, onChangeForm, setRef, onSignIn} = props;

    const [isShowPassword, setShowPassword] = useState(false);

    const handleOnChangeForm = ({target}) => {
        const name = target.name;
        const value = target.value;

        let newForm = {...form};

        newForm[name] = value;

        onChangeForm(newForm)
    }
    const handleOnSignIn = (form, events) => {
        onSignIn(form, events);
    }

    const handleOnChangeShowPassword = () => {
        setShowPassword(!isShowPassword);
    }

    return (
        <Formik
            innerRef={setRef}
            initialValues={form}
            validationSchema={validationSchema}
            onSubmit={handleOnSignIn}
        >
            {({
                  errors,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values
              }) => {
                return (
                    <form
                        style={{maxWidth: 500}}

                        onSubmit={handleSubmit}
                        onKeyDown={({keyCode}) => (keyCode === 13) && handleSubmit()}
                    >

                        <Box mt={3}>

                            <Typography variant={'formTitle'}>Ваша почта</Typography>

                            <TextField
                                fullWidth
                                error={Boolean(touched.login && errors.login)}
                                helperText={touched.login && errors.login}
                                margin="normal"
                                name="login"
                                placeholder="info@wise.cards"
                                value={values.login}
                                variant="outlined"
                                onChange={handleOnChangeForm}
                            />

                        </Box>

                        <Box mt={3}>

                            <Typography variant={'formTitle'}>Пароль</Typography>

                            <TextField
                                fullWidth
                                error={Boolean(touched.password && errors.password)}
                                helperText={touched.password && errors.password}
                                margin="normal"
                                name="password"
                                placeholder="********"
                                type={isShowPassword ? 'text' : 'password'}
                                value={values.password}
                                variant="outlined"
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleOnChangeShowPassword}
                                                edge="end"
                                            >
                                                {isShowPassword ? <EyeOffIcon/> : <EyeIcon/>}
                                            </IconButton>
                                        </InputAdornment>,
                                }}
                                onChange={handleOnChangeForm}
                            />

                        </Box>

                        <Box mt={5}>

                            <Button variant="contained" onClick={handleSubmit}>
                                Войти
                            </Button>

                        </Box>

                    </form>
                )
            }}
        </Formik>
    )
};

export default FormAuthorization