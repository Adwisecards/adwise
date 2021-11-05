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

const initialForm = {
    file: null,
    name: "",
    index: ""
};

const DialogCreated = (props) => {
    const { isOpen, onClose, onCreate } = props;
    const formRef = useRef();

    const [form, setForm] = useState({...initialForm});

    useEffect(() => {
        setForm({...initialForm});
    }, [isOpen]);


    const handleOnSubmit = (form) => {
        onCreate(form);
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
                <Typography variant="h3">Создания преимущества</Typography>
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
                                    <Typography variant="formTitle">Наименование</Typography>
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
                                            Boolean(!values.file) ? (
                                                <>
                                                    <Button component="span">Загрузить иконку</Button>
                                                </>
                                            ) : (
                                                <Grid container>
                                                    <Grid item>
                                                        <Box bgcolor="#ED8E00" px={2} py={1} borderRadius={4} style={{cursor: 'pointer'}}>
                                                            <Typography variant="h4">{values.file?.name}</Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            )
                                        }

                                        <input
                                            hidden
                                            name="file"
                                            type="file"
                                            accept=".svg"
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
                                            <Button variant="contained" size="small" onClick={handleSubmit}>Создать</Button>
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
    file: Yup.mixed().required('Выберите').nullable(true),
});

export default DialogCreated
