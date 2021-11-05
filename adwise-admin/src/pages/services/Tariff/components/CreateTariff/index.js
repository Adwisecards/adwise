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
    name: Yup.string().max(255).required('Заполните поле'),
    price: Yup.number().min(1).required('Заполните поле'),
    limit: Yup.number().min(1).required('Заполните поле'),
    currency: Yup.string().required('Заполните поле'),
    managerReward: Yup.number().min(1).required('Заполните поле'),
    refBonus: Yup.number().min(1).required('Заполните поле'),
    period: Yup.number().min(1).required('Заполните поле')
});

const initialForm = {
    name: '',
    currency: '',
    price: '',
    limit: '',
    managerReward: '',
    refBonus: '',
    period: 1,
    wisewinOption: false
};

const CreateTariff = (props) => {
    const {isOpen, isUseWiseDefault, onClose, onCreateTariff} = props;

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
        onCreateTariff(form, events);
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

    const handleOnClearItem = () => {}

    return (
        <Dialog
            open={isOpen}

            maxWidth="md"
            fullWidth

            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">Создание тарифа</Typography>
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

                                <Box mb={2}>
                                    <Typography variant="formTitle">Лимит сотрудников || акций</Typography>

                                    <TextField
                                        fullWidth
                                        error={Boolean(touched.limit && errors.limit)}
                                        helperText={touched.limit && errors.limit}
                                        margin="normal"
                                        name="limit"
                                        type="number"
                                        placeholder="..."
                                        value={values.limit}
                                        variant="outlined"
                                        onChange={handleOnChangeForm}

                                        InputProps={{
                                            endAdornment: <TextFieldButtonClear value={values.limit} name="limit" onClick={handleOnClearItem}/>
                                        }}
                                    />

                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">Награда менеджера</Typography>

                                    <TextField
                                        fullWidth
                                        error={Boolean(touched.managerReward && errors.managerReward)}
                                        helperText={touched.managerReward && errors.managerReward}
                                        margin="normal"
                                        type="number"
                                        name="managerReward"
                                        placeholder="..."
                                        value={values.managerReward}
                                        variant="outlined"
                                        onChange={handleOnChangeForm}

                                        InputProps={{
                                            endAdornment: <TextFieldButtonClear value={values.managerReward} name="managerReward" onClick={handleOnClearItem}/>
                                        }}
                                    />

                                    <Typography variant="caption">Если есть свободная лицензия. Если нет лицензии, то % в зависимости от пакета. Если нет пакета то 5%</Typography>
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">Бонус реферальной сети</Typography>

                                    <TextField
                                        fullWidth
                                        error={Boolean(touched.refBonus && errors.refBonus)}
                                        helperText={touched.refBonus && errors.refBonus}
                                        margin="normal"
                                        name="refBonus"
                                        type="number"
                                        placeholder="..."
                                        value={values.refBonus}
                                        variant="outlined"
                                        onChange={handleOnChangeForm}

                                        InputProps={{
                                            endAdornment: <TextFieldButtonClear value={values.refBonus} name="refBonus" onClick={handleOnClearItem}/>
                                        }}
                                    />

                                    <Typography variant="caption">Для 2 - 6 уровней</Typography>
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">Период</Typography>

                                    <TextField
                                        fullWidth
                                        error={Boolean(touched.period && errors.period)}
                                        helperText={touched.period && errors.period}
                                        margin="normal"
                                        name="period"
                                        type="number"
                                        placeholder="..."
                                        value={values.period}
                                        variant="outlined"
                                        onChange={handleOnChangeForm}

                                        InputProps={{
                                            endAdornment: <TextFieldButtonClear value={values.period} name="period" onClick={handleOnClearItem}/>
                                        }}
                                    />

                                    <Typography variant="caption">Количество месяцев</Typography>
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

export default CreateTariff
