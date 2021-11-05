import React, {
    useRef,
    useState,
    useEffect
} from "react";
import {
    Box,

    TextField,

    Typography,

    CircularProgress,
} from '@material-ui/core';
import {} from '@material-ui/styles';
import * as Yup from "yup";
import {Formik} from "formik";
import MyRegexp from "myregexp";

const validationSchema = Yup.object().shape({
    firstName: Yup.string().max(255).required('Заполните поле'),
    email: Yup.string().max(255).required('Заполните поле').email('Не правильно заполнен email'),
    phone: Yup.string().matches(MyRegexp.phone(), 'Не верный формат phone'),
});

const FormMain = (props) => {
    const {setRef, account, onChange} = props;

    const handleSubmit = () => {}

    const handleOnChange = ({ target }) => {
        const name = target.name;
        const value = target.value;

        let newAccount = {...account};
        newAccount[name] = value;

        onChange(newAccount)
    }

    return (
        <Formik
            innerRef={setRef}

            initialValues={account}
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
                        <Box mb={4}>
                            <Typography variant="formTitle">Имя</Typography>

                            <TextField
                                fullWidth
                                error={Boolean(touched.firstName && errors.firstName)}
                                helperText={touched.firstName && errors.firstName}
                                placeholder={"Иван"}
                                margin="normal"
                                name="firstName"
                                value={values.firstName}
                                variant="outlined"
                                onChange={handleOnChange}
                                onBlur={handleBlur}
                            />
                        </Box>

                        <Box mb={4}>
                            <Typography variant="formTitle">Фамилия</Typography>

                            <TextField
                                fullWidth
                                error={Boolean(touched.lastName && errors.lastName)}
                                helperText={touched.lastName && errors.lastName}
                                placeholder={"Иванов"}
                                margin="normal"
                                name="lastName"
                                value={values.lastName}
                                variant="outlined"
                                onChange={handleOnChange}
                                onBlur={handleBlur}
                            />
                        </Box>

                        <Box mb={4}>
                            <Typography variant="formTitle">Отчество</Typography>

                            <TextField
                                fullWidth
                                placeholder={"Иванович"}
                                margin="normal"
                                variant="outlined"
                            />
                        </Box>

                        <Box mb={4}>
                            <Typography variant="formTitle">Телефон для связи</Typography>

                            <TextField
                                fullWidth
                                placeholder={"+71234567890"}
                                error={Boolean(touched.phone && errors.phone)}
                                helperText={touched.phone && errors.phone}
                                margin="normal"
                                name="phone"
                                variant="outlined"
                                value={values.phone}
                                onChange={handleOnChange}
                            />
                        </Box>

                        <Box mb={4}>
                            <Typography variant="formTitle">E-mail</Typography>

                            <TextField
                                fullWidth
                                error={Boolean(touched.email && errors.email)}
                                helperText={touched.email && errors.email}
                                placeholder={"Ромашка"}
                                margin="normal"
                                name="email"
                                disabled
                                value={values.email}
                                variant="outlined"
                            />
                        </Box>
                    </>
                )
            }}
        </Formik>
    )
}

export default FormMain
