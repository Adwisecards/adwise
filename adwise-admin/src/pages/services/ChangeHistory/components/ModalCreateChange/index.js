import React, {useRef, useState, useEffect} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,

    Typography,

    Grid,
    Box,

    Button,
    Select,
    MenuItem,
    FormControl,
    TextField
} from "@material-ui/core";
import {Formik} from "formik";

import * as Yup from "yup";
import changeHistoryTypes from "../../../../../constants/changeHistoryTypes";
import {
    TextCKEditor
} from "../../../../../components";
import {MobileDatePicker} from "@material-ui/pickers";

const validationSchema = Yup.object().shape({
    type: Yup.string().max(255).required('Заполните поле'),
    title: Yup.string().max(255).required('Заполните поле'),
    date: Yup.date().required('Заполните поле'),
    version: Yup.string().required('Заполните поле'),
    comment: Yup.string().required('Заполните поле'),
});

const initialForm = {
    type: '',
    title: '',
    date: new Date(),
    version: '',
    comment: ''
};

const ModalCreateChange = (props) => {
    const {isOpen, onClose, onSubmit} = props;

    const [form, setForm] = useState(initialForm);

    const refForm = useRef();

    useEffect(() => {
        setForm(initialForm);
    }, [isOpen]);

    const handleChangeForm = ({target}) => {
        const { name, value } = target;

        let newForm = {...form};
        newForm[name] = value;

        setForm(newForm);
        refForm.current.setValues(newForm);
    }
    const handleChangeFormDate = (name, value) => {
        handleChangeForm({
            target: {
                name,
                value
            }
        })
    }

    const handleOnSubmit = (form, events) => {
        onSubmit(form);
    }

    return (
        <Dialog
            open={isOpen}

            maxWidth="md"
            fullWidth

            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">Создание версии</Typography>
            </DialogTitle>

            <DialogContent>

                <Formik
                    innerRef={refForm}
                    initialValues={form}
                    validationSchema={validationSchema}
                    onSubmit={handleOnSubmit}
                >
                    {({
                          values,
                          touched,
                          errors,
                          handleSubmit
                      }) => (
                        <>

                            <Box mb={2}>

                                <Typography variant="formTitle">Система</Typography>

                                <FormControl margin="normal" fullWidth>
                                    <Select
                                        name="type"
                                        variant="outlined"
                                        value={values.type}

                                        error={Boolean(touched.type && errors.type)}
                                        helperText={touched.type && errors.type}

                                        onChange={handleChangeForm}
                                    >
                                        <MenuItem value="">Сбросить</MenuItem>

                                        {
                                            Object.keys(changeHistoryTypes).map((key) => {
                                                const value = key;
                                                const title = changeHistoryTypes[key];

                                                return (
                                                    <MenuItem value={value}>{title}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Заголовок</Typography>

                                <TextField
                                    name="title"
                                    variant="outlined"
                                    margin="normal"
                                    placeholder="..."

                                    error={Boolean(touched.title && errors.title)}
                                    helperText={touched.title && errors.title}

                                    value={values.title}

                                    fullWidth

                                    onChange={handleChangeForm}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Версия</Typography>

                                <TextField
                                    name="version"
                                    variant="outlined"
                                    margin="normal"
                                    placeholder="..."

                                    error={Boolean(touched.version && errors.version)}
                                    helperText={touched.version && errors.version}

                                    value={values.version}

                                    fullWidth

                                    onChange={handleChangeForm}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Дата выхода релиза</Typography>

                                <MobileDatePicker
                                    error={Boolean(touched.date && errors.date)}
                                    helperText={touched.date && errors.date}
                                    value={values.date}
                                    name="date"
                                    margin="normal"
                                    openTo="year"
                                    format="dd.MM.yyyy"
                                    views={["year", "month", "date"]}
                                    onChange={(date) => handleChangeFormDate('date', date)}

                                    renderInput={(props) => (
                                        <TextField {...props} fullWidth variant="outlined" margin="normal"/>
                                    )}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Комментарий</Typography>

                                <TextCKEditor
                                    name="comment"

                                    value={values.comment}
                                    error={Boolean(touched.comment && errors.comment)}
                                    helperText={touched.comment && errors.comment}

                                    onChange={handleChangeForm}
                                />

                            </Box>

                            <Box mt={4} mb={2}>

                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Button variant="contained" size="small" onClick={handleSubmit}>Создать</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="outlined" size="small" onClick={onClose}>Отмена</Button>
                                    </Grid>
                                </Grid>

                            </Box>

                        </>
                    )}
                </Formik>

            </DialogContent>

        </Dialog>
    )
};

export default ModalCreateChange
