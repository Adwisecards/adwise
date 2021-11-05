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
    MenuItem
} from "@material-ui/core";
import {Formik} from "formik";

import * as Yup from "yup";
import axiosInstance from "../../../../../agent/agent";
import apiUrls from "../../../../../constants/apiUrls";
import {Autocomplete} from "@material-ui/lab";
import {MobileDatePicker} from "@material-ui/pickers";
import currency from "../../../../../constants/currency";
import {formatMoney} from "../../../../../helper/format";

const validationSchema = Yup.object().shape({
    organizationId: Yup.string().max(255).required('Заполните поле'),
    date: Yup.date().required('Заполните поле'),
    packetId: Yup.string().required('Заполните поле'),
    sum: Yup.number().min(1).required('Заполните поле')
});

const initialForm = {
    organizationId: '',
    date: new Date(),
    packetId: '',
    sum: '',
    reason: '',
};

const CreateSaleLicense = (props) => {
    const {isOpen, onClose, onCreateSaleLicense} = props;

    const formRef = useRef();

    const [form, setForm] = useState(initialForm);
    const [organizationList, setOrganizationList] = useState([]);
    const [tariffsList, setTariffsList] = useState([]);

    useEffect(() => {
        handleSetTariffsList();
    }, []);
    useEffect(() => {
        setForm({...initialForm});
        formRef.current?.setValues(initialForm);
    }, [isOpen]);

    const handleOnSubmit = (form, events) => {
        onCreateSaleLicense(form, events);
    }

    const handleSetTariffsList = () => {
        axiosInstance.get(apiUrls["get-packets"]).then((response) => {
            setTariffsList(response.data.data.packets)
        });
    }

    const handleOnChangeForm = ({target}) => {
        const {name, value} = target;

        let newForm = {...form};

        newForm[name] = value;

        setForm(newForm);
        formRef.current.setValues(newForm);
    }
    const handleOnChangeDateForm = (name, value) => {
        let newForm = {...form};
        newForm[name] = value;

        setForm(newForm);
        formRef.current.setValues(newForm);
    }
    const handleOnChangePacket = ({target}) => {
        const {name, value} = target;
        const paket = tariffsList.find((item) => item._id === value);

        let newForm = {...form};

        newForm[name] = value;
        newForm.sum = paket.price;

        setForm(newForm);
        formRef.current.setValues(newForm);
    }

    const handleOnSearchOrganization = async (event, search) => {
        const searchUrl = `?name=${search}&sortBy=name&order=1&pageSize=20&pageNumber=1`

        const organization = await axiosInstance(`${apiUrls["find-organizations"]}${searchUrl}`).then((response) => {
            return response.data.data.organizations
        })

        setOrganizationList(organization);
    }
    const handleOnChangeOrganization = ({ target }, value) => {
        const name = "organizationId";

        let newForm = {...form};

        newForm[name] = value._id;

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
                <Typography variant="h3">Создание продажу лицензии</Typography>
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

                                    <Typography variant="formTitle">Организация</Typography>

                                    <Autocomplete
                                        options={organizationList}
                                        fullWidth
                                        disableClearable
                                        getOptionLabel={(option) => {
                                            if (!option.manager) {
                                                return `${ option.name } ( Менеджер не назначен )`
                                            }

                                            return `${ option.name } ( ${ option.manager.lastName || '' } ${ option.manager.firstName || '' } )`
                                        }}
                                        onInputChange={handleOnSearchOrganization}
                                        name="organizationId"
                                        onChange={handleOnChangeOrganization}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                name="organizationId"
                                                variant="outlined"
                                                margin="normal"
                                                error={Boolean(touched.organizationId && errors.organizationId)}
                                                helperText={touched.organizationId && errors.organizationId}
                                            />
                                        )}
                                    />

                                    <Typography variant="caption">В скобках указывается менеджер</Typography>

                                </Box>

                                <Box mb={2}>

                                    <Typography variant="formTitle">Пакет</Typography>

                                    <FormControl margin="normal" fullWidth>
                                        <Select
                                            name="packetId"
                                            variant="outlined"
                                            value={values.packetId}
                                            error={Boolean(touched.packetId && errors.packetId)}
                                            helperText={touched.packetId && errors.packetId}
                                            onChange={handleOnChangePacket}
                                        >
                                            <MenuItem value="">Сбросить</MenuItem>

                                            {
                                                tariffsList.map((item) => {
                                                    const value = item._id;
                                                    const title = item.name;

                                                    return (
                                                        <MenuItem value={ value }>{ title } ({ formatMoney(item.price) } { currency[item.currency] })</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>

                                </Box>

                                <Box mb={2}>

                                    <Typography variant="formTitle">Сумма</Typography>

                                    <TextField
                                        fullWidth
                                        value={values.sum}
                                        variant="outlined"
                                        name="sum"
                                        placeholder="..."
                                        margin="normal"
                                        error={Boolean(touched.sum && errors.sum)}
                                        helperText={touched.sum && errors.sum}
                                        onChange={handleOnChangeForm}
                                    />

                                </Box>

                                <Box mb={2}>

                                    <Typography variant="formTitle">Основание</Typography>

                                    <TextField
                                        fullWidth
                                        value={values.reason}
                                        variant="outlined"
                                        name="reason"
                                        placeholder="..."
                                        margin="normal"
                                        error={Boolean(touched.reason && errors.reason)}
                                        helperText={touched.reason && errors.reason}
                                        onChange={handleOnChangeForm}
                                    />

                                </Box>

                                <Box mb={2}>

                                    <Typography variant="formTitle">Дата</Typography>

                                    <MobileDatePicker
                                        error={Boolean(touched.date && errors.date)}
                                        helperText={touched.date && errors.date}
                                        value={values.date}
                                        name="date"
                                        maxDate={new Date()}
                                        margin="normal"
                                        openTo="year"
                                        format="dd.MM.yyyy"
                                        views={["year", "month", "date"]}
                                        onChange={(date) => handleOnChangeDateForm('date', date)}

                                        renderInput={(props) => (
                                            <TextField {...props} fullWidth variant="outlined" margin="normal"/>
                                        )}
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
                        )
                    }}
                </Formik>

            </DialogContent>

        </Dialog>
    )
}

export default CreateSaleLicense
