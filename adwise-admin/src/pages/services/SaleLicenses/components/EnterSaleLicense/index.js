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
    Tabs,
    Tab
} from "@material-ui/core";
import {Formik} from "formik";
import CreateCustomPaket from "./CreateCustomPaket";
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
    reason: Yup.string().required('Заполните поле'),
    sum: Yup.number().min(0).required('Заполните поле'),
    sumRef: Yup.number().min(0).required('Заполните поле')
});

const initialForm = {
    organizationId: '',
    date: new Date(),
    packetId: '',
    sum: '',
    sumRef: '',
    reason: '',
    customPacket: {
        name: '',
        price: '',
        limit: '',
        currency: '',
        managerReward: '',
        refBonus: ''
    }
};


const CreateSaleLicense = (props) => {
    const {isOpen, onClose, onCreateSaleLicense} = props;

    const formRef = useRef();

    const [form, setForm] = useState(initialForm);
    const [organizationList, setOrganizationList] = useState([]);
    const [tariffsList, setTariffsList] = useState([]);
    const [isCustomPacket, setCustomPacket] = useState('select');

    useEffect(() => {
        handleSetTariffsList();
    }, []);
    useEffect(() => {
        setForm({...initialForm});
        formRef.current?.setValues(initialForm);
    }, [isOpen]);

    const handleOnSubmit = (form, events) => {
        let formSubmit = {...form};

        formSubmit.customPacket.managerReward = Number.parseFloat(formSubmit.sum);
        formSubmit.customPacket.refBonus = Number.parseFloat(formSubmit.sumRef);
        delete formSubmit.packetId;
        delete formSubmit.sum;

        onCreateSaleLicense(formSubmit, events);
    }

    const handleSetTariffsList = () => {
        axiosInstance.get(`${apiUrls["get-packets"]}?all=1`).then((response) => {
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
        newForm.sum = paket.managerReward;
        newForm.sumRef = paket.refBonus;

        newForm.customPacket = {
            name: paket?.name,
            price: paket?.price,
            limit: paket?.limit,
            currency: 'rub',
            managerReward: paket?.managerReward,
            refBonus: paket.refBonus
        };

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

    console.log('form: ', form);

    return (
        <Dialog
            open={isOpen}

            maxWidth="md"
            fullWidth

            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">Добавление продажи лицензии</Typography>
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

                                    <Typography variant="formTitle">Сумма (сумма выплаты менеджеру)</Typography>

                                    <TextField
                                        value={values.sum}
                                        name="sum"
                                        type="number"
                                        placeholder="0"
                                        onChange={handleOnChangeForm}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        error={Boolean(touched.sum && errors.sum)}
                                        helperText={touched.sum && errors.sum}
                                    />

                                </Box>

                                <Box mb={2}>

                                    <Typography variant="formTitle">Сумма (сумма реферальной сети)</Typography>

                                    <TextField
                                        value={values.sumRef}
                                        name="sumRef"
                                        type="number"
                                        placeholder="0"
                                        onChange={handleOnChangeForm}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        error={Boolean(touched.sumRef && errors.sumRef)}
                                        helperText={touched.sumRef && errors.sumRef}
                                    />

                                </Box>

                                <Box mb={2}>

                                    <Typography variant="formTitle">Причина установки продажи</Typography>

                                    <TextField
                                        value={values.reason}
                                        name="reason"
                                        placeholder="Введите"
                                        onChange={handleOnChangeForm}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        error={Boolean(touched.reason && errors.reason)}
                                        helperText={touched.reason && errors.reason}
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
                                            <Button variant="contained" size="small" onClick={handleSubmit}>Добавить</Button>
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
