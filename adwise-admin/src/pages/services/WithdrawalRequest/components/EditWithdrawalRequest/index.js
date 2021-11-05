import React, {useState, useRef, useEffect} from "react";
import {
    Box,

    Grid,

    Button,

    Typography,

    Dialog,
    DialogTitle,
    DialogContent,

    Tabs,
    Tab,

    TextField
} from "@material-ui/core";
import {
    Autocomplete
} from "@material-ui/lab";
import {MobileDatePicker} from '@material-ui/pickers';

import {Formik} from 'formik';
import * as Yup from 'yup';
import axiosInstance from "../../../../../agent/agent";
import apiUrls from "../../../../../constants/apiUrls";
import {
    OrganizationAutocomplete
} from "../../../../../components";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";

const validationSchemaOrganization = Yup.object().shape({
    organizationId: Yup.string().max(255).required('Заполните поле'),
    comment: Yup.string().max(255).required('Заполните поле'),
    timestamp: Yup.date().required('Заполните поле'),
    sum: Yup.number().min(1).required('Заполните поле')
});
const validationSchemaManager = Yup.object().shape({
    userId: Yup.string().max(255).required('Заполните поле'),
    comment: Yup.string().max(255).required('Заполните поле'),
    timestamp: Yup.date().required('Заполните поле'),
    sum: Yup.number().min(1).required('Заполните поле')
});

const initialFormOrganization = {organizationId: '', sum: '', comment: '', timestamp: new Date()};
const initialFormManager = {userId: '', sum: '', comment: '', timestamp: new Date()};

const EditWithdrawalRequest = (props) => {
    const {initialForm, isOpen, onClose, onSubmit} = props;

    const [activeTab, setActiveTab] = useState('organization');
    const [form, setForm] = useState({});

    const refFormOrganization = useRef();
    const refFormManager = useRef();

    useEffect(() => {
        let form = {};

        if (initialForm.organization){
            form.organizationId = initialForm.organization._id;
            form.sum = initialForm.sum;
            form.comment = initialForm.comment;
            form.timestamp = new Date(initialForm.timestamp);

            setActiveTab('organization');
            setForm(form);
        }
        if (initialForm.manager){
            form.userId = initialForm.user._id;
            form.sum = initialForm.sum;
            form.comment = initialForm.comment;
            form.timestamp = new Date(initialForm.timestamp);

            setActiveTab('manager');
            setForm(form);
        }
    }, [isOpen]);
    useEffect(() => {
        if (activeTab === "organization"){
            refFormOrganization.current?.setValues(form);
        }
        if (activeTab === "manager"){
            refFormManager.current?.setValues(form);
        }
    }, [form]);

    const handleOnChangeForm = ({ target }) => {
        const { name, value } = target;

        let newForm = {...form};
        newForm[name] = value;

        setForm(newForm);

        if (activeTab === 'organization') {refFormOrganization.current.setValues(newForm)}
        if (activeTab === 'manager') {refFormManager.current.setValues(newForm)}

    }
    const handleOnChangeDateForm = (name, value) => {
        let newForm = {...form};
        newForm[name] = value;

        setForm(newForm);

        if (activeTab === 'organization') {refFormOrganization.current.setValues(newForm)}
        if (activeTab === 'manager') {refFormManager.current.setValues(newForm)}

    }

    return (
        <Dialog
            maxWidth="md"

            fullWidth

            open={isOpen}
            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">Редактирование запроса на вывод</Typography>
            </DialogTitle>

            <DialogContent>

                <Box mb={2}>

                    <Tabs value={activeTab} onChange={(event, tab) => setActiveTab(tab)}>
                        <Tab value="organization" label="Организация"/>
                        <Tab value="manager" label="Менеджер"/>
                    </Tabs>

                </Box>

                {activeTab === 'organization' && (
                    <FormOrganization
                        innerRef={refFormOrganization}
                        initialValues={initialFormOrganization}

                        onSubmit={onSubmit}
                        onClose={onClose}
                        onChange={handleOnChangeForm}
                        onChangeDate={handleOnChangeDateForm}
                    />
                )}
                {activeTab === 'manager' && (
                    <FormManager
                        innerRef={refFormManager}
                        initialValues={initialFormManager}

                        onSubmit={onSubmit}
                        onClose={onClose}
                        onChange={handleOnChangeForm}
                        onChangeDate={handleOnChangeDateForm}
                    />
                )}

            </DialogContent>

        </Dialog>
    )
};

const FormOrganization = (props) => {
    const {innerRef, initialValues, onSubmit, onChange, onClose, onChangeDate} = props;

    return (
        <>

            <Formik
                innerRef={innerRef}

                initialValues={initialValues}
                validationSchema={validationSchemaOrganization}
                onSubmit={onSubmit}
            >
                {(props) => {
                    const {errors, touched, values, handleSubmit} = props;

                    return (
                        <>

                            <Box mb={2}>

                                <Typography variant="formTitle">Организация</Typography>

                                {
                                    values["organizationId"] && (
                                        <OrganizationAutocomplete
                                            name="organizationId"
                                            placeholder="..."
                                            value={values["organizationId"]}
                                            initialValue={values["organizationId"]}

                                            onChange={onChange}
                                        />
                                    )
                                }

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Сумма вывода</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.sum && errors.sum)}
                                    helperText={touched.sum && errors.sum}
                                    margin="normal"
                                    name="sum"
                                    type="number"
                                    placeholder="..."
                                    value={values.sum}
                                    variant="outlined"
                                    onChange={onChange}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Дата</Typography>

                                <MobileDatePicker
                                    error={Boolean(touched.timestamp && errors.timestamp)}
                                    helperText={touched.timestamp && errors.timestamp}
                                    value={values.timestamp}
                                    name="timestamp"
                                    margin="normal"
                                    openTo="year"
                                    format="dd.MM.yyyy"
                                    views={["year", "month", "date"]}
                                    onChange={(date) => onChangeDate('timestamp', date)}

                                    renderInput={(props) => (
                                        <TextField {...props} fullWidth variant="outlined" margin="normal"/>
                                    )}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Комментарий</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.comment && errors.comment)}
                                    helperText={touched.comment && errors.comment}
                                    margin="normal"
                                    name="comment"
                                    multiline
                                    rows={2}
                                    rowsMax={2}
                                    placeholder="..."
                                    value={values.comment}
                                    variant="outlined"
                                    onChange={onChange}
                                />

                            </Box>

                            <Box mt={2} mb={2}>

                                <Grid container spacing={2}>
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

        </>
    )
}
const FormManager = (props) => {
    const {innerRef, initialValues, onSubmit, onChange, onClose, onChangeDate} = props;

    const [managerList, setManagerList] = useState([]);

    const handleOnSearchManager = async (event, search) => {
        const searchUrl = `?lastName=${search}&sortBy=firstName&order=1&pageSize=20&pageNumber=1`;

        const users = await axiosInstance(`${apiUrls["find-users"]}${searchUrl}`).then((response) => {
            return response.data.data.users
        })

        setManagerList(users);
    }
    const handleOnChangeManager = ({ target }, value) => {
        onChange({
            target: {
                name: 'userId',
                value: (!!value) ? value._id : ''
            }
        })
    }

    const handleGetUserMoney = (wallet) => {
        let sum = wallet.bonusPoints + wallet.cashbackPoints + wallet.points;

        return `~ ${ formatMoney(sum, 2, '.') } ${ currency[wallet.currency] }`
    }

    return (
        <>

            <Formik
                innerRef={innerRef}

                initialValues={initialValues}
                validationSchema={validationSchemaManager}
                onSubmit={onSubmit}
            >
                {(props) => {
                    const {errors, touched, values, handleSubmit} = props;

                    return (
                        <>

                            <Box mb={2}>

                                <Typography variant="formTitle">Менеджер</Typography>

                                <Autocomplete
                                    options={managerList}
                                    fullWidth
                                    disableClearable
                                    getOptionLabel={(option) => `${ option.lastName || '' } ${ option.firstName || '' } (${ handleGetUserMoney(option.wallet) })`}
                                    onInputChange={handleOnSearchManager}
                                    name="userId"
                                    onChange={handleOnChangeManager}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            margin="normal"
                                            error={Boolean(touched.userId && errors.userId)}
                                            helperText={touched.userId && errors.userId}
                                        />
                                    )}
                                />

                                <Typography variant="caption">Поиск осуществляется по "Фамилии"</Typography>


                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Сумма вывода</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.sum && errors.sum)}
                                    helperText={touched.sum && errors.sum}
                                    margin="normal"
                                    name="sum"
                                    type="number"
                                    placeholder="..."
                                    value={values.sum}
                                    variant="outlined"
                                    onChange={onChange}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Дата</Typography>

                                <MobileDatePicker
                                    error={Boolean(touched.timestamp && errors.timestamp)}
                                    helperText={touched.timestamp && errors.timestamp}
                                    value={values.timestamp}
                                    name="timestamp"
                                    margin="normal"
                                    openTo="year"
                                    format="dd.MM.yyyy"
                                    views={["year", "month", "date"]}
                                    onChange={(date) => onChangeDate('timestamp', date)}

                                    renderInput={(props) => (
                                        <TextField {...props} fullWidth variant="outlined" margin="normal"/>
                                    )}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Комментарий</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.comment && errors.comment)}
                                    helperText={touched.comment && errors.comment}
                                    margin="normal"
                                    name="comment"
                                    multiline
                                    rows={2}
                                    rowsMax={2}
                                    placeholder="..."
                                    value={values.comment}
                                    variant="outlined"
                                    onChange={onChange}
                                />

                            </Box>

                            <Box mt={2} mb={2}>

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

        </>
    )
}

export default EditWithdrawalRequest

