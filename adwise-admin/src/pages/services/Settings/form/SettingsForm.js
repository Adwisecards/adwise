import React from "react";
import {
    Box,
    Grid,
    Button,
    Switch,
    TextField,
    Typography, Link
} from "@material-ui/core";
import {

} from "@material-ui/styles";
import {Formik} from "formik";
import {
    X as XIcon
} from "react-feather";

import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    contactEmail: Yup.string().required('Заполните поле'),
    managerPercent: Yup.number().required('Заполните поле'),
    minimalPayment: Yup.number().required('Заполните поле'),
    purchasePercent: Yup.number().required('Заполните поле'),
    balanceUnfreezeTerms: Yup.number().required('Заполните поле'),
    paymentGatewayPercent: Yup.number().required('Заполните поле'),
    paymentGatewayMinimalFee: Yup.number().required('Заполните поле'),
    maximumPayment: Yup.number().required('Заполните поле'),
    paymentRetention: Yup.number().required('Заполните поле'),
    tipsMinimalAmount: Yup.number().min(0, 'Сумма чаевых не может быть меньше 0').required('Заполните поле'),
});

const SettingsForm = (props) => {
    const { innerRef, initialForm, onChangeForm, onSaveSettings } = props;

    const handleOnChangeForm = ({ target }) => {
        const { name, value } = target;

        let newForm = initialForm;

        newForm[name] = value;

        onChangeForm(newForm);
    }
    const handleOnChangeSwitch = ({ target }, value) => {
        const { name } = target;

        let newForm = initialForm;

        newForm[name] = value;

        onChangeForm(newForm);
    }

    const handleOnAddEmail = () => {
        let newForm = initialForm;
        newForm.spareContactEmails.push('');
        onChangeForm(newForm);
    }
    const handleOnChangeFormEmails = ({target}, idx) => {
        let newForm = initialForm;
        const { value } = target;

        newForm.spareContactEmails[idx] = value;

        onChangeForm(newForm);
    }
    const handleOnDeleteEmail = (idx) => {
        let newForm = initialForm;
        newForm.spareContactEmails.splice(idx, 1);

        onChangeForm(newForm);
    }

    return (
        <>

            <Formik
                innerRef={innerRef}
                initialValues={initialForm}
                validationSchema={validationSchema}
                onSubmit={onSaveSettings}
            >
                {(props) => {
                    const { errors, isSubmitting, touched, values, handleSubmit } = props;

                    return (
                        <>

                            <Box mb={2}>

                                <Typography variant="formTitle">Процент менеджера c оборота компании</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.managerPercent && errors.managerPercent)}
                                    helperText={touched.managerPercent && errors.managerPercent}
                                    margin="normal"
                                    name="managerPercent"
                                    type="number"
                                    placeholder="..."
                                    value={values.managerPercent}
                                    variant="outlined"
                                    onChange={handleOnChangeForm}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Процент Adwise</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.purchasePercent && errors.purchasePercent)}
                                    helperText={touched.purchasePercent && errors.purchasePercent}
                                    margin="normal"
                                    name="purchasePercent"
                                    type="number"
                                    placeholder="..."
                                    value={values.purchasePercent}
                                    variant="outlined"
                                    onChange={handleOnChangeForm}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Минимальная выплата</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.minimalPayment && errors.minimalPayment)}
                                    helperText={touched.minimalPayment && errors.minimalPayment}
                                    margin="normal"
                                    name="minimalPayment"
                                    type="number"
                                    placeholder="..."
                                    value={values.minimalPayment}
                                    variant="outlined"
                                    onChange={handleOnChangeForm}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Дней заморозки бонусов</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.balanceUnfreezeTerms && errors.balanceUnfreezeTerms)}
                                    helperText={touched.balanceUnfreezeTerms && errors.balanceUnfreezeTerms}
                                    margin="normal"
                                    name="balanceUnfreezeTerms"
                                    type="number"
                                    placeholder="..."
                                    value={values.balanceUnfreezeTerms}
                                    variant="outlined"
                                    onChange={handleOnChangeForm}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Комиссия Тинькофф</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.paymentGatewayPercent && errors.paymentGatewayPercent)}
                                    helperText={touched.paymentGatewayPercent && errors.paymentGatewayPercent}
                                    margin="normal"
                                    name="paymentGatewayPercent"
                                    type="number"
                                    placeholder="..."
                                    value={values.paymentGatewayPercent}
                                    variant="outlined"
                                    onChange={handleOnChangeForm}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Минимальная сумма комиссии платежного шлюза</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.paymentGatewayMinimalFee && errors.paymentGatewayMinimalFee)}
                                    helperText={touched.paymentGatewayMinimalFee && errors.paymentGatewayMinimalFee}
                                    margin="normal"
                                    name="paymentGatewayMinimalFee"
                                    type="number"
                                    placeholder="..."
                                    value={values.paymentGatewayMinimalFee}
                                    variant="outlined"
                                    onChange={handleOnChangeForm}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Минимальная сумма чаевых</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.tipsMinimalAmount && errors.tipsMinimalAmount)}
                                    helperText={touched.tipsMinimalAmount && errors.tipsMinimalAmount}
                                    margin="normal"
                                    name="tipsMinimalAmount"
                                    type="number"
                                    placeholder="..."
                                    value={values.tipsMinimalAmount}
                                    variant="outlined"
                                    onChange={handleOnChangeForm}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Максимальная сумма выплаты</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.maximumPayment && errors.maximumPayment)}
                                    helperText={touched.maximumPayment && errors.maximumPayment}
                                    margin="normal"
                                    name="maximumPayment"
                                    type="number"
                                    placeholder="..."
                                    value={values.maximumPayment}
                                    variant="outlined"
                                    onChange={handleOnChangeForm}
                                />

                            </Box>

                            <Box mb={2}>

                                <Typography variant="formTitle">Максимальный срок удержания платежа</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.paymentRetention && errors.paymentRetention)}
                                    helperText={touched.paymentRetention && errors.paymentRetention}
                                    margin="normal"
                                    name="paymentRetention"
                                    type="number"
                                    placeholder="..."
                                    value={values.paymentRetention}
                                    variant="outlined"
                                    onChange={handleOnChangeForm}
                                />

                            </Box>

                            <Box mb={4}>

                                <Typography variant="formTitle">Контактный email</Typography>

                                <TextField
                                    fullWidth
                                    error={Boolean(touched.contactEmail && errors.contactEmail)}
                                    helperText={touched.contactEmail && errors.contactEmail}
                                    margin="normal"
                                    name="contactEmail"
                                    placeholder="..."
                                    value={values.contactEmail}
                                    variant="outlined"
                                    onChange={handleOnChangeForm}
                                />

                            </Box>

                            <Box mb={4}>

                                <Typography variant="formTitle">Вспомогательные email <Link href="#" onClick={handleOnAddEmail}>Добавить</Link></Typography>

                                <Grid container spacing={1}>
                                    {
                                        values.spareContactEmails.map((email, idx) => {
                                            return (
                                                <Grid xs={12}>
                                                    <Grid container spacing={1} alignItems="center">
                                                        <Grid item style={{flex: 1}}>
                                                            <TextField
                                                                fullWidth
                                                                margin="normal"
                                                                placeholder="..."
                                                                value={email}
                                                                variant="outlined"
                                                                onChange={(event) => handleOnChangeFormEmails(event, idx)}
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                style={{padding: 0, minWidth: 40, width: 40, height: 40, marginTop: 8}}
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={() => handleOnDeleteEmail(idx)}
                                                            >
                                                                <XIcon color="#8152E4"/>
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                            </Box>

                            <Box mb={4}>

                                <Typography variant="formTitle">Технические работы</Typography>

                                <Box mt={2}>

                                    <Grid container alignItems="center" spacing={2}>
                                        <Grid item>
                                            <Typography variant="body2">Выключен</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Switch
                                                checked={values.technicalWorks}
                                                color="primary"
                                                name="technicalWorks"

                                                onChange={(event) => handleOnChangeSwitch(event, !values.technicalWorks)}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body2">Включен</Typography>
                                        </Grid>
                                    </Grid>

                                </Box>

                            </Box>

                            <Button variant="contained" onClick={handleSubmit}>Изменить</Button>

                        </>
                    )
                }}
            </Formik>

        </>
    )
};

export default SettingsForm
