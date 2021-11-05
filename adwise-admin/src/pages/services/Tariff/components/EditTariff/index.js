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
    Checkbox
} from "@material-ui/core";
import {Formik} from "formik";

import * as Yup from "yup";
import {TextFieldButtonClear} from "../../../../../components";
import currency from "../../../../../constants/currency";

const validationSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Заполните поле')
});

const EditTariff = (props) => {
    const {initialForm, isOpen, isUseWiseDefault, onClose, onChangeTariff} = props;

    const formRef = useRef();

    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (isOpen) {
            setForm(initialForm);

            if (formRef.current) {
                formRef.current.setValues(initialForm);
            }
        }
    }, [isOpen]);

    const handleOnSubmit = (form, events) => {
        onChangeTariff(form, true);
    }

    const handleOnChangeForm = ({ target }) => {
        const { name, value } = target;

        let newForm = {...form};

        newForm[name] = value;

        setForm(newForm);
        formRef.current.setValues(newForm);
    }
    const handleOnChangeCheckBoxForm = ({ target }, value) => {
        const { name } = target;

        let newForm = {...form};

        newForm[name] = !value;

        setForm(newForm);
        formRef.current.setValues(newForm);
    }

    const handleOnClearItem = (name) => {}

    return (
        <Dialog
            open={isOpen}

            maxWidth="md"
            fullWidth

            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">Редактирование тарифа "{initialForm.name}"</Typography>
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
                                    <Grid container spacing={4}>
                                        <Grid item xs={8}>
                                            <Typography variant="formTitle">Стоимость пакета</Typography>

                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.price && errors.price)}
                                                helperText={touched.price && errors.price}
                                                margin="normal"
                                                name="price"
                                                type="number"
                                                placeholder="..."
                                                value={values.price}
                                                variant="outlined"
                                                onChange={handleOnChangeForm}

                                                InputProps={{
                                                    endAdornment: <TextFieldButtonClear value={values.price} name="price" onClick={handleOnClearItem}/>
                                                }}
                                            />

                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="formTitle">Валюта пакета</Typography>

                                            <FormControl margin="normal" fullWidth>
                                                <Select
                                                    name="currency"
                                                    variant="outlined"
                                                    error={Boolean(touched.currency && errors.currency)}
                                                    helperText={touched.currency && errors.currency}
                                                    value={values.currency}
                                                    onChange={handleOnChangeForm}
                                                >
                                                    <MenuItem value="">Сбросить</MenuItem>

                                                    {
                                                        Object.keys(currency).map((key) => {
                                                            const value = key;
                                                            const title = currency[key];

                                                            return (
                                                                <MenuItem value={ value }>{ title }</MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box mb={4}>
                                    <FormControlLabel
                                        control={<Checkbox checked={Boolean(values.wisewinOption)} name="wisewinOption" onChange={(event) => handleOnChangeCheckBoxForm(event, Boolean(values.wisewinOption))} />}
                                        label="Доступно на льготных условиях при авторизации через Wise Win"
                                    />
                                </Box>

                                <Box mb={2}>
                                    <Grid container spacing={2} justify="flex-end">
                                        <Grid item>
                                            <Button variant="contained" size="small" onClick={handleSubmit}>Изменить</Button>
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

export default EditTariff
