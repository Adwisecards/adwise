import React, {useState, useRef, useEffect} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,

    Typography,

    Box,

    TextField,

    Button,

    Grid,

    FormControl,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox, Switch
} from "@material-ui/core";
import {Formik} from "formik";
import {DropzoneArea} from 'material-ui-dropzone'

import * as Yup from "yup";
import {TextFieldButtonClear} from "../../../../../components";
import currency from "../../../../../constants/currency";

const validationSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Заполните поле'),
    type: Yup.string().max(255).required('Заполните поле'),
    description: Yup.string().min(1).required('Заполните поле'),
    document: Yup.mixed().required("Загрузите файл").test("fileSize", "File too large", value => value && value.size <= 5000000)
});

const initialForm = {
    name: '',
    type: undefined,
    description: '',
    document: '',
    disabled: false
};

const CreateDocument = (props) => {
    const {isOpen, onClose, onCreate} = props;

    const formRef = useRef();

    const [form, setForm] = useState({...initialForm});

    useEffect(() => {
        setForm({...initialForm});
        formRef.current?.setValues({...initialForm});
    }, [isOpen]);


    const handleOnSubmit = (form, events) => {
        onCreate(form, events);
    }

    const handleOnChangeForm = ({ target }) => {
        const { name, value } = target;

        let newForm = {...form};

        newForm[name] = value;

        setForm(newForm);
        formRef.current.setValues(newForm);
    }
    const handleOnChangeFormCheckbox = ({ target }) => {
        const { name } = target;

        let newForm = {...form};

        newForm[name] = !newForm[name];

        setForm(newForm);
        formRef.current.setValues(newForm);
    }
    const handleOnChangeUploadForm = (files, name) => {
        const file = files[0];

        let newForm = {...form};

        newForm[name] = file;

        setForm(newForm);
        formRef.current.setValues(newForm);
    }

    const handleOnClearItem = (name) => {
        let newForm = {...form};

        newForm[name] = "";

        setForm(newForm);
        formRef.current.setValues(newForm);
    }

    return (
        <Dialog
            open={isOpen}

            maxWidth="md"
            fullWidth

            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">Создание документа</Typography>
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
                                    <Typography variant="formTitle">Наименоване</Typography>

                                    <TextField
                                        fullWidth
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                        margin="normal"
                                        name="name"
                                        placeholder="..."
                                        value={values.name}
                                        variant="outlined"
                                        onChange={handleOnChangeForm}

                                        InputProps={{
                                            endAdornment: <TextFieldButtonClear value={values.name} name="name" onClick={handleOnClearItem}/>
                                        }}
                                    />
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">Описание</Typography>

                                    <TextField
                                        fullWidth
                                        error={Boolean(touched.description && errors.description)}
                                        helperText={touched.description && errors.description}
                                        margin="normal"
                                        name="description"
                                        type="number"
                                        multiline
                                        rows={2}
                                        rowsMax={2}
                                        placeholder="..."
                                        value={values.description}
                                        variant="outlined"
                                        onChange={handleOnChangeForm}

                                        InputProps={{
                                            endAdornment: <TextFieldButtonClear value={values.description} name="description" onClick={handleOnClearItem}/>
                                        }}
                                    />
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">Тип платформы</Typography>

                                    <FormControl
                                        margin="normal"
                                        fullWidth
                                        error={Boolean(touched.type && errors.type)}
                                        helperText={touched.type && errors.type}
                                    >
                                        <Select
                                            name="type"
                                            variant="outlined"
                                            error={Boolean(touched.type && errors.type)}
                                            helperText={touched.type && errors.type}
                                            value={values.type}
                                            onChange={handleOnChangeForm}
                                        >
                                            <MenuItem value="">Сбросить</MenuItem>
                                            <MenuItem value="cards">AdWise Cards</MenuItem>
                                            <MenuItem value="business">AdWise Business</MenuItem>
                                            <MenuItem value="crm">CRM/WEB</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">Документ</Typography>

                                    <Box mt={2}>
                                        <DropzoneArea
                                            dropzoneText="Выберите или перенесите файл"

                                            acceptedFiles={['application/pdf']}
                                            maxFileSize={5000000}
                                            filesLimit={1}
                                            onChange={(files) => handleOnChangeUploadForm(files, 'document')}
                                        />

                                        {
                                            Boolean(touched.document && errors.document) && (
                                                <Typography variant="body2" color="error">{ touched.document && errors.document }</Typography>
                                            )
                                        }
                                    </Box>
                                </Box>

                                <Box mb={2}>
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

export default CreateDocument
