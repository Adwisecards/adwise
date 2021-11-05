import React, { useState, useRef, useEffect} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,

    Typography,

    Box,
    Grid,

    Button, TextField,
} from "@material-ui/core";
import InputMask from "react-input-mask";
import * as Yup from "yup";
import MyRegexp from "myregexp";
import {Formik} from "formik";

const ModalEdit = (props) => {
    const {
        isOpen,

        initForm,

        onClose,
        onEdit
    } = props;

    useEffect(() => {

        if (isOpen) {
            handleSetInitialForm();
        }

    }, [isOpen]);

    const refFormik = useRef();

    const [form, setForm] = useState({});

    const handleSetInitialForm = () => {
        const form = {
            inn: initForm?.legal?.info?.inn,
            fullName: initForm?.legal?.info?.fullName,
            phones: initForm.phones[0] || ''
        };

        setForm(form);

        if (refFormik.current) {
            refFormik.current.setValues(newForm);
        }
    }
    const handleOnChangeForm = ({ target }) => {
        const { name, value } = target;

        let newForm = {...form};
        newForm[name] = value;

        setForm(newForm);
        refFormik.current.setValues(newForm);
    }

    const handleSubmit = (form) => {
        onEdit(form)
    }

    return (
        <Dialog
            open={isOpen}

            maxWidth="md"

            fullWidth

            onClose={onClose}
        >

            <DialogTitle>

                <Typography variant="h3">Редактирование организации ""</Typography>

            </DialogTitle>

            <DialogContent>

                <Box>

                    <Formik
                        innerRef={refFormik}
                        initialValues={form}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {(props) => {
                            const { errors, values, touched, handleSubmit } = props;

                            return (
                                <Grid container spacing={2}>

                                    <Grid item xs={12}>

                                        <Box mb={2}>
                                            <Typography variant="formTitle">Полное наименование организации</Typography>

                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.fullName && errors.fullName)}
                                                helperText={touched.fullName && errors.fullName}
                                                placeholder={'...'}
                                                margin='normal'
                                                name='fullName'
                                                value={values.fullName}
                                                variant='outlined'
                                                onChange={handleOnChangeForm}
                                            />
                                        </Box>

                                        <Box mb={2}>
                                            <Typography variant="formTitle">ИНН орагнизации</Typography>

                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.inn && errors.inn)}
                                                helperText={touched.inn && errors.inn}
                                                placeholder={'...'}
                                                margin='normal'
                                                name='inn'
                                                value={values.inn}
                                                variant='outlined'
                                                onChange={handleOnChangeForm}
                                            />
                                        </Box>

                                        <Box mb={2}>
                                            <Typography variant="formTitle">Телефон организации</Typography>

                                            <InputMask
                                                mask="+7 (999) 999 99 99"
                                                name='phones'
                                                value={values.phones}
                                                onChange={handleOnChangeForm}

                                                maskChar="_"
                                            >
                                                {() => (
                                                    <TextField
                                                        fullWidth
                                                        error={Boolean(touched.phones && errors.phones)}
                                                        helperText={touched.phones && errors.phones}
                                                        placeholder={'...'}
                                                        margin='normal'
                                                        name='phones'
                                                        value={values.phones}
                                                        variant='outlined'
                                                    />
                                                )}
                                            </InputMask>
                                        </Box>

                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box>
                                            <Grid container spacing={2}>
                                                <Grid item>
                                                    <Button variant="contained" onClick={handleSubmit}>Изменить</Button>
                                                </Grid>

                                                <Grid item>
                                                    <Button variant="outlined" onClick={onClose}>Отмена</Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>

                                </Grid>
                            )
                        }}
                    </Formik>

                </Box>

            </DialogContent>

        </Dialog>
    )
};

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Заполните поле'),
    inn: Yup.string().min(10, 'Минимум 10 символов').max(12, 'Максимум 12 символов').required('Заполните поле'),
    phones: Yup.string().required('Заполните поле')
});

export default ModalEdit
