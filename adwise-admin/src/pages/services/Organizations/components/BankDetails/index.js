import React, {useState, useRef} from "react";
import {
    Box,
    Grid,
    Button,
    Typography,

    TextField,
    FormControl,
    Select,
    MenuItem,

    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@material-ui/core";
import {
    withStyles
} from "@material-ui/styles";
import * as Yup from "yup";
import MyRegexp from "myregexp";
import InputMask from "react-input-mask";
import {Formik} from "formik";
import {DatePicker, MobileDatePicker} from "@material-ui/pickers";
import moment from "moment";
import axiosInstance from "../../../../../agent/agent";
import {store} from "react-notifications-component";
import apiUrls from "../../../../../constants/apiUrls";

const organizationBandDetails = {
    "billingDescriptor": "",
    "fullName": "",
    "name": "",
    "inn": "",
    "kpp": "",
    "ogrn": "",
    "addresses.type": "",
    "addresses.zip": "",
    "addresses.country": "",
    "addresses.city": "",
    "addresses.street": "",
    "phones.type": "",
    "phones.phone": "",
    "email": "",
    "ceo.firstName": "",
    "ceo.lastName": "",
    "ceo.middleName": "",
    "ceo.birthDate": "",
    "ceo.phone": "",
    "bankAccount.account": "",
    "bankAccount.korAccount": "",
    "bankAccount.bankName": "",
    "bankAccount.bik": "",
    "bankAccount.details": "",
    "bankAccount.tax": "",
    "siteUrl": "",
};

class FormOrganizationBankDetails extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            form: organizationBandDetails
        };

        this.refFormik = React.createRef();
    }

    onSubmitForm = (form, events) => {
        const {organization} = this.props;
        const body = this.onGetBody(form);

        axiosInstance.put(`${apiUrls["organization-create-organization-shop"]}${organization._id}`, body).then(() => {
            store.addNotification({
                title: 'Успешно',
                message: 'Данные для создания банковского счета успешно отправлены',
                type: 'success',
                insert: 'top',
                container: 'bottom-left',
                dismiss: {
                    duration: 3000,
                    onScreen: false,
                    pauseOnHover: true,
                    delay: 0
                }
            });
        }).catch((error) => {
            store.addNotification({
                title: "Ошибка системы",
                message: "Смотри консоль",
                type: 'danger',
                insert: 'top',
                container: 'bottom-left',
                dismiss: {
                    duration: 3000,
                    onScreen: false,
                    pauseOnHover: true,
                    delay: 0
                }
            });
        });
    }
    onGetBody = (form) => {
        let body = {
            billingDescriptor: form['billingDescriptor'],
            fullName: form['fullName'],
            name: form['name'],
            inn: form['inn'],
            kpp: form['kpp'],
            email: form['email'],
            ogrn: form['ogrn'],
            addresses: [
                {
                    type: form['addresses.type'],
                    zip: form['addresses.zip'],
                    country: form['addresses.country'],
                    city: form['addresses.city'],
                    street: form['addresses.street'],
                }
            ],
            phones: [
                {
                    type: form['phones.type'],
                    phone: form['phones.phone'].replace(/[^\d]/g, ''),
                }
            ],
            ceo: {
                firstName: form['ceo.firstName'],
                lastName: form['ceo.lastName'],
                middleName: form['ceo.middleName'],
                birthDate: moment(form['ceo.birthDate']).format('YYYY-MM-DD'),
                phone: form['ceo.phone'].replace(/[^\d]/g, ''),
            },
            bankAccount: {
                account: form['bankAccount.account'],
                korAccount: form['bankAccount.korAccount'],
                bankName: form['bankAccount.bankName'],
                bik: form['bankAccount.bik'],
                details: form['bankAccount.details'],
                tax: form['bankAccount.tax'],
            }
        };

        return body
    }

    onChangeForm = ({target}) => {
        const {name, value} = target;

        let form = {...this.state.form};

        form[name] = value;

        this.setState({form});
        this.refFormik.current.setValues(form);
    }

    onChangeFormDate = (event, name) => {
        if (!event) {
            return null
        }

        const body = {
            target: {
                name: name,
                value: event
            }
        }

        this.onChangeForm(body)
    }

    render() {
        const {classes, isOpen, onClose, organization} = this.props;

        const handleOnChangeForm = this.onChangeForm;

        return (

            <Dialog
                open={isOpen}
                onClose={onClose}

                fullWidth
                maxWidth="xl"
            >

                <DialogTitle>
                    <Typography variant="h3">Заполнение банк. реквезитов "{ organization.name }"</Typography>
                </DialogTitle>

                <DialogContent>
                    <Formik
                        innerRef={this.refFormik}
                        initialValues={this.state.form}
                        validationSchema={validationSchema}
                        onSubmit={this.onSubmitForm}
                    >
                        {(props) => {
                            const {errors, values, touched, handleSubmit} = props;

                            return (
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box mb={4}>
                                            <Box mb={2}>
                                                <Typography variant="h5">Основная информация</Typography>
                                            </Box>

                                            <Box mb={2}>
                                                <Typography variant="formTitle">Наименование на иностранном
                                                    языке</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched.billingDescriptor && errors.billingDescriptor)}
                                                    helperText={touched.billingDescriptor && errors.billingDescriptor}
                                                    placeholder={'...'}
                                                    margin='normal'
                                                    name='billingDescriptor'
                                                    value={values.billingDescriptor}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Полное наименование
                                                    организации</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched.fullName && errors.fullName)}
                                                    helperText={touched.fullName && errors.fullName}
                                                    placeholder={'Иванов И. И.'}
                                                    margin='normal'
                                                    name='fullName'
                                                    value={values.fullName}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Сокращенное наименование
                                                    организации</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched.name && errors.name)}
                                                    helperText={touched.name && errors.name}
                                                    placeholder={'Имя'}
                                                    margin='normal'
                                                    name='name'
                                                    value={values.name}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">ИНН</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched.inn && errors.inn)}
                                                    helperText={touched.inn && errors.inn}
                                                    placeholder={'0123456789'}
                                                    margin='normal'
                                                    name='inn'
                                                    value={values.inn}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">КПП</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched.kpp && errors.kpp)}
                                                    helperText={touched.kpp && errors.kpp}
                                                    placeholder={'012345678'}
                                                    margin='normal'
                                                    name='kpp'
                                                    value={values.kpp}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Электронный адрес
                                                    организации</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['email'] && errors['email'])}
                                                    helperText={touched['email'] && errors['email']}
                                                    placeholder={'***'}
                                                    margin='normal'
                                                    name='email'
                                                    value={values['email']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Адрес интернет сайта </Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['siteUrl'] && errors['siteUrl'])}
                                                    helperText={touched['siteUrl'] && errors['siteUrl']}
                                                    placeholder={'***'}
                                                    margin='normal'
                                                    name='siteUrl'
                                                    value={values['siteUrl']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">ОГРН</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['ogrn'] && errors['ogrn'])}
                                                    helperText={touched['ogrn'] && errors['ogrn']}
                                                    placeholder={'***'}
                                                    margin='normal'
                                                    name='ogrn'
                                                    value={values['ogrn']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                        </Box>

                                        <Box mb={4}>
                                            <Box mb={2}>
                                                <Typography variant="h5">Реквизиты банковского счета</Typography>
                                            </Box>

                                            <Box mb={2}>
                                                <Typography variant="formTitle">Реквизиты предприятия для перечисления
                                                    возмещения</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['bankAccount.account'] && errors['bankAccount.account'])}
                                                    helperText={touched['bankAccount.account'] && errors['bankAccount.account']}
                                                    placeholder={'***'}
                                                    margin='normal'
                                                    name='bankAccount.account'
                                                    value={values['bankAccount.account']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Корреспондентский счет</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['bankAccount.korAccount'] && errors['bankAccount.korAccount'])}
                                                    helperText={touched['bankAccount.korAccount'] && errors['bankAccount.korAccount']}
                                                    placeholder={'***'}
                                                    margin='normal'
                                                    name='bankAccount.korAccount'
                                                    value={values['bankAccount.korAccount']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Наименование банка</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['bankAccount.bankName'] && errors['bankAccount.bankName'])}
                                                    helperText={touched['bankAccount.bankName'] && errors['bankAccount.bankName']}
                                                    placeholder={'***'}
                                                    margin='normal'
                                                    name='bankAccount.bankName'
                                                    value={values['bankAccount.bankName']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">БИК</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['bankAccount.bik'] && errors['bankAccount.bik'])}
                                                    helperText={touched['bankAccount.bik'] && errors['bankAccount.bik']}
                                                    placeholder={'***'}
                                                    margin='normal'
                                                    name='bankAccount.bik'
                                                    value={values['bankAccount.bik']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Основание</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['bankAccount.details'] && errors['bankAccount.details'])}
                                                    helperText={touched['bankAccount.details'] && errors['bankAccount.details']}
                                                    placeholder={'***'}
                                                    margin='normal'
                                                    name='bankAccount.details'
                                                    value={values['bankAccount.details']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Отчисления в пользу Предприятия, % от
                                                    суммы операции</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['bankAccount.tax'] && errors['bankAccount.tax'])}
                                                    helperText={touched['bankAccount.tax'] && errors['bankAccount.tax']}
                                                    placeholder={'***'}
                                                    margin='normal'
                                                    name='bankAccount.tax'
                                                    type="number"
                                                    value={values['bankAccount.tax']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Box mb={4}>
                                            <Box mb={2}>
                                                <Typography variant="h5">Адрес</Typography>
                                            </Box>

                                            <Box mb={2}>
                                                <Typography variant="formTitle">Тип адреса</Typography>

                                                <FormControl margin="normal" fullWidth>
                                                    <Select
                                                        name='addresses.type'
                                                        variant="outlined"
                                                        error={Boolean(touched['addresses.type'] && errors['addresses.type'])}
                                                        helperText={touched['addresses.type'] && errors['addresses.type']}
                                                        value={values['addresses.type']}
                                                        onChange={handleOnChangeForm}
                                                    >
                                                        <MenuItem value="">Сбросить</MenuItem>
                                                        <MenuItem value="legal">юридический</MenuItem>
                                                        <MenuItem value="actual">фактический</MenuItem>
                                                        <MenuItem value="post">почтовый</MenuItem>
                                                        <MenuItem value="other">прочий</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Почтовый индекс</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['addresses.zip'] && errors['addresses.zip'])}
                                                    helperText={touched['addresses.zip'] && errors['addresses.zip']}
                                                    placeholder={'***'}
                                                    margin='normal'
                                                    name='addresses.zip'
                                                    value={values['addresses.zip']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Трехбуквенный код страны по
                                                    ISO</Typography>

                                                <FormControl margin="normal" fullWidth>
                                                    <Select
                                                        fullWidth
                                                        error={Boolean(touched['addresses.country'] && errors['addresses.country'])}
                                                        helperText={touched['addresses.country'] && errors['addresses.country']}
                                                        placeholder={'...'}
                                                        margin='normal'
                                                        name='addresses.country'
                                                        value={values['addresses.country']}
                                                        variant='outlined'
                                                        onChange={handleOnChangeForm}
                                                    >
                                                        <MenuItem value="">Сбросить</MenuItem>
                                                        <MenuItem value="RUS">Россия</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Город или населенный пункт</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['addresses.city'] && errors['addresses.city'])}
                                                    helperText={touched['addresses.city'] && errors['addresses.city']}
                                                    placeholder={'...'}
                                                    margin='normal'
                                                    name='addresses.city'
                                                    value={values['addresses.city']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Улица, дом, корпус, квартира, офис и
                                                    т.д.</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['addresses.street'] && errors['addresses.street'])}
                                                    helperText={touched['addresses.street'] && errors['addresses.street']}
                                                    placeholder={'***'}
                                                    margin='normal'
                                                    name='addresses.street'
                                                    value={values['addresses.street']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                        </Box>

                                        <Box mb={4}>

                                            <Box mb={2}>
                                                <Typography variant="h5">Генеральный директор</Typography>
                                            </Box>

                                            <Box mb={2}>
                                                <Typography variant="formTitle">Имя</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['ceo.firstName'] && errors['ceo.firstName'])}
                                                    helperText={touched['ceo.firstName'] && errors['ceo.firstName']}
                                                    placeholder={'***'}
                                                    margin='normal'
                                                    name='ceo.firstName'
                                                    value={values['ceo.firstName']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Фамилия</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['ceo.lastName'] && errors['ceo.lastName'])}
                                                    helperText={touched['ceo.lastName'] && errors['ceo.lastName']}
                                                    placeholder={'***'}
                                                    margin='normal'
                                                    name='ceo.lastName'
                                                    value={values['ceo.lastName']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Отчество</Typography>

                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched['ceo.middleName'] && errors['ceo.middleName'])}
                                                    helperText={touched['ceo.middleName'] && errors['ceo.middleName']}
                                                    placeholder={'***'}
                                                    margin='normal'
                                                    name='ceo.middleName'
                                                    value={values['ceo.middleName']}
                                                    variant='outlined'
                                                    onChange={handleOnChangeForm}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Дата рождения</Typography>

                                                <MobileDatePicker
                                                    error={Boolean(touched['ceo.birthDate'] && errors['ceo.birthDate'])}
                                                    helperText={touched['ceo.birthDate'] && errors['ceo.birthDate']}
                                                    value={values['ceo.birthDate']}
                                                    name="ceo.birthDate"
                                                    margin="normal"
                                                    openTo="year"
                                                    format="dd.MM.yyyy"
                                                    views={["year", "month", "date"]}
                                                    onChange={(event) => this.onChangeFormDate(event, 'ceo.birthDate')}

                                                    renderInput={(props) => (
                                                        <TextField {...props} fullWidth variant="outlined" margin="normal"/>
                                                    )}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Контактный телефон</Typography>

                                                <InputMask
                                                    mask="+7 (999) 999 99 99"
                                                    name='ceo.phone'
                                                    value={values['ceo.phone']}
                                                    onChange={handleOnChangeForm}

                                                    maskChar="_"
                                                >
                                                    {() => <TextField
                                                        fullWidth
                                                        error={Boolean(touched['ceo.phone'] && errors['ceo.phone'])}
                                                        helperText={touched['ceo.phone'] && errors['ceo.phone']}
                                                        placeholder={'+7 (___) ___ __ __'}
                                                        margin='normal'
                                                        name='ceo.phone'
                                                        value={values['ceo.phone']}
                                                        variant='outlined'
                                                    />}
                                                </InputMask>
                                            </Box>
                                        </Box>

                                        <Box mb={4}>
                                            <Box mb={2}>
                                                <Typography variant="h5">Телефон</Typography>
                                            </Box>

                                            <Box mb={2}>
                                                <Typography variant="formTitle">Тип телефона</Typography>

                                                <FormControl margin="normal" fullWidth>
                                                    <Select
                                                        name='phones.type'
                                                        variant="outlined"
                                                        error={Boolean(touched['phones.type'] && errors['phones.type'])}
                                                        helperText={touched['phones.type'] && errors['phones.type']}
                                                        value={values['phones.type']}
                                                        onChange={handleOnChangeForm}
                                                    >
                                                        <MenuItem value="">Сбросить</MenuItem>
                                                        <MenuItem value="common">основной</MenuItem>
                                                        <MenuItem value="fax">факс</MenuItem>
                                                        <MenuItem value="other">прочий</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <Box mb={2}>
                                                <Typography variant="formTitle">Телефон</Typography>

                                                <InputMask
                                                    mask="+7 (999) 999 99 99"
                                                    name='phones.phone'
                                                    value={values['phones.phone']}
                                                    onChange={handleOnChangeForm}

                                                    maskChar="_"
                                                >
                                                    {() => <TextField
                                                        fullWidth
                                                        error={Boolean(touched['phones.phone'] && errors['phones.phone'])}
                                                        helperText={touched['phones.phone'] && errors['phones.phone']}
                                                        placeholder={'+7 (___) ___ __ __'}
                                                        margin='normal'
                                                        name='phones.phone'
                                                        value={values['phones.phone']}
                                                        variant='outlined'
                                                    />}
                                                </InputMask>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button variant="contained" onClick={handleSubmit}>Отправить</Button>
                                    </Grid>
                                </Grid>
                            )
                        }}
                    </Formik>
                </DialogContent>
            </Dialog>
        )
    }
}

const styles = {
    root: {
        maxWidth: 1000,

        padding: 32,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(168, 171, 184, 0.6)',
        borderRadius: 8,
    }
}

const validationSchema = Yup.object().shape({
    billingDescriptor: Yup.string().required('Заполните поле'),
    fullName: Yup.string().required('Заполните поле'),
    name: Yup.string().required('Заполните поле'),
    inn: Yup.string().min(10, 'Минимум 10 символов').max(10, 'Максимум 10 символов').required('Заполните поле'),
    kpp: Yup.string().min(9, 'Минимум 9 символов').max(9, 'Максимум 9 символов').required('Заполните поле'),
    ogrn: Yup.string().required('Заполните поле'),
    "addresses.type": Yup.string().required('Заполните поле'),
    "addresses.zip": Yup.string().required('Заполните поле'),
    "addresses.country": Yup.string().required('Заполните поле'),
    "addresses.city": Yup.string().required('Заполните поле'),
    "addresses.street": Yup.string().required('Заполните поле'),
    "phones.type": Yup.string().required('Заполните поле'),
    "phones.phone": Yup.string().matches('^\\+7 ((\\(\\d{3}\\) ?)|(\\d{3}-))?\\d{3} \\d{2} \\d{2}', 'Не правильно введен номер телефона').required('Заполните поле'),
    "email": Yup.string().matches(MyRegexp.email(), 'Не правильно введен Email').required('Заполните поле'),
    "ceo.firstName": Yup.string().required('Заполните поле'),
    "ceo.lastName": Yup.string().required('Заполните поле'),
    "ceo.middleName": Yup.string().required('Заполните поле'),
    "ceo.birthDate": Yup.date('Не верный формат даты').required('Заполните поле'),
    "ceo.phone": Yup.string().matches('^\\+7 ((\\(\\d{3}\\) ?)|(\\d{3}-))?\\d{3} \\d{2} \\d{2}', 'Не правильно введен номер телефона').required('Заполните поле'),
    "bankAccount.account": Yup.string().required('Заполните поле'),
    "bankAccount.korAccount": Yup.string().required('Заполните поле'),
    "bankAccount.bankName": Yup.string().required('Заполните поле'),
    "bankAccount.bik": Yup.string().required('Заполните поле'),
    "bankAccount.details": Yup.string().required('Заполните поле'),
    "bankAccount.tax": Yup.string().required('Заполните поле'),
});

export default withStyles(styles)(FormOrganizationBankDetails)
