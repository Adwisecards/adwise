import React, { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Grid,
    Button,
    Typography,
    TextField,
    FormHelperText
} from "@material-ui/core";
import * as Yup from "yup";
import {Formik} from "formik";

const DialogCreated = (props) => {
    const { isOpen, onClose, onEdit, initialForm } = props;
    const formRef = useRef();

    const [form, setForm] = useState({...initialForm});

    useEffect(() => {
        setForm({...initialForm});
    }, [isOpen]);

    const handleOnSubmit = (form) => {
        onEdit(form, true);
    }
    const handleOnChangeForm = ({target}) => {
        const { name, value } = target;

        let newForm = {...form};
        newForm[name] = value;

        setForm(newForm);
        formRef.current.setValues(newForm);
    }
    const handleOnChangeFormFile = ({target}) => {
        const { name, files } = target;

        let newForm = {...form};
        newForm[name] = files[0];

        setForm(newForm);
        formRef.current.setValues(newForm);
    }

    return (
        <Dialog
            open={isOpen}
            fullWidth
            maxWidth="md"
            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">Редактирование преимущества</Typography>
            </DialogTitle>

            <DialogContent>
                <Formik
                    innerRef={formRef}
                    initialValues={form}
                    validationSchema={validationSchema}
                    onSubmit={handleOnSubmit}
                >
                    {({
                          errors,
                          handleSubmit,
                          isSubmitting,
                          touched,
                          values
                      }) => {
                        return (
                            <>

                                <Box mb={2}>
                                    <Typography variant="formTitle">Наименование организации</Typography>
                                    <TextField
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Введите"
                                        name="name"
                                        value={values.name}
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                        onChange={handleOnChangeForm}
                                    />
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">Описание</Typography>
                                    <TextField
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Введите"
                                        name="description"
                                        value={values.description}
                                        error={Boolean(touched.description && errors.description)}
                                        helperText={touched.description && errors.description}
                                        onChange={handleOnChangeForm}
                                    />
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">Ссылка на видео с ютуба</Typography>
                                    <TextField
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Введите"
                                        name="presentationUrl"
                                        value={values.presentationUrl}
                                        error={Boolean(touched.presentationUrl && errors.presentationUrl)}
                                        helperText={touched.presentationUrl && errors.presentationUrl}
                                        onChange={handleOnChangeForm}
                                    />
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">Сортировочный номер</Typography>
                                    <TextField
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Введите"
                                        name="index"
                                        type="number"
                                        value={values.index}
                                        error={Boolean(touched.index && errors.index)}
                                        helperText={touched.index && errors.index}
                                        onChange={handleOnChangeForm}
                                    />
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">Изображение</Typography>

                                    <label>

                                        {
                                            Boolean(!values.file && !values.picture) ? (
                                                <>
                                                    <Button component="span">Загрузить иконку</Button>
                                                </>
                                            ) : (
                                                <Grid container>
                                                    <Grid item>
                                                        <Box bgcolor="#ED8E00" px={2} py={1} borderRadius={4} style={{cursor: 'pointer'}}>
                                                            <Typography variant="h4">{values.file?.name || values.picture || ''}</Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            )
                                        }

                                        <input
                                            hidden
                                            name="file"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleOnChangeFormFile}
                                        />
                                    </label>

                                    {
                                        Boolean(touched.file && errors.file) && (
                                            <Typography variant="caption" color="error">{touched.file && errors.file}</Typography>
                                        )
                                    }

                                </Box>

                                <Box mt={4} mb={2}>
                                    <Grid container spacing={2} justify="flex-end">
                                        <Grid item>
                                            <Button variant="contained" size="small" onClick={handleSubmit}>Редактировать</Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant="outlined" size="small" onClick={onClose}>Отмена</Button>
                                        </Grid>
                                    </Grid>
                                </Box>

                            </>
                        )
                    }}
                </Formik>
            </DialogContent>

        </Dialog>
    )
}

const validationSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Заполните поле'),
    file: Yup.mixed().nullable(true),
});

export default DialogCreated
