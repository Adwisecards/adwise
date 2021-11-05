import React, {useState, useRef} from "react";
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

import * as Yup from "yup";
import {TextFieldButtonClear} from "../../../../../components";
import currency from "../../../../../constants/currency";

const validationSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Заполните поле'),
    description: Yup.string().max(255).required('Заполните поле'),
    points: Yup.number().min(1).required('Заполните поле')
});

const initialForm = {
    name: '',
    description: '',
    points: '',
    disabled: false
};

const CreateTask = (props) => {
    const {isOpen, isUseWiseDefault, onClose, onCreateTask} = props;

    const formRef = useRef();

    const [form, setForm] = useState(initialForm);

    const handleOnSubmit = (form, events) => {
        onCreateTask(form, events);
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

    return (
        <Dialog
            open={isOpen}

            maxWidth="md"
            fullWidth

            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">Создание задачи</Typography>
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
                                    />
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">Награда</Typography>

                                    <TextField
                                        fullWidth
                                        error={Boolean(touched.points && errors.points)}
                                        helperText={touched.points && errors.points}
                                        margin="normal"
                                        name="points"
                                        type="number"
                                        placeholder="..."
                                        value={values.points}
                                        variant="outlined"
                                        onChange={handleOnChangeForm}
                                    />
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">Описание задачи</Typography>

                                    <TextField
                                        fullWidth
                                        error={Boolean(touched.description && errors.description)}
                                        helperText={touched.description && errors.description}
                                        margin="normal"
                                        name="description"
                                        multiline
                                        rows={3}
                                        rowsMax={3}
                                        placeholder="..."
                                        value={values.description}
                                        variant="outlined"
                                        onChange={handleOnChangeForm}
                                    />
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">Статус задачи</Typography>

                                    <Grid style={{ marginTop: 16 }} container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Typography variant="body2">Не активна</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Switch
                                                checked={!values.disabled}
                                                onChange={handleOnChangeFormCheckbox}
                                                color="primary"
                                                name="disabled"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body2">Aктивна</Typography>
                                        </Grid>
                                    </Grid>
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

export default CreateTask
