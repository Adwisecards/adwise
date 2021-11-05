import * as Yup from "yup";
import moment from "moment";
import {formatDate} from "../../helper/format";

const ip = [
    {
        tab: {
            label: "Организация",
            value: "organization"
        },
        sections: [
            {
                title: "Основная информация",
                items: [
                    {
                        name: "organizationName",
                        title: 'Наименование организации',
                        placeholder: 'ИП Иванов И.И.',
                        type: 'string',
                        isGlobalDisabled: true,
                        validationSchema: Yup.string().required('Обязательно к заполнению')
                    },
                    {
                        name: "billingDescriptor",
                        title: 'Наименование на англиском',
                        placeholder: '***',
                        type: 'string',
                        isGlobalDisabled: true,
                        validationSchema: Yup
                            .string()
                            .max(14, 'Максимум 14 символов')
                            .required('Обязательно к заполнению')
                            .matches(
                                /^[A-z0-9.\- _ ]+.$/,
                                "Наименование должно быть на Английском языке"
                            ),
                    },
                    {
                        name: "inn",
                        title: 'ИНН',
                        placeholder: '66747470123',
                        type: 'number',
                        isGlobalDisabled: true,
                        validationSchema: Yup
                            .string()
                            .min(12, 'Минимум 12 символов')
                            .max(12, 'Максимум 12 символов')
                            .required('Обязательно к заполнению')
                            .matches(
                                /^[0-9]+.$/,
                                "ИНН может содержать только числа"
                            ),
                    },
                    {
                        name: "ogrn",
                        title: 'ОГРНИП',
                        placeholder: '66747470123',
                        type: 'number',
                        isGlobalDisabled: true,
                        validationSchema: Yup.string().min(15, 'Минимум 15 символов').max(15, 'Максимум 15 символов').required('Обязательно к заполнению')
                    },
                    {
                        name: "siteUrl",
                        title: 'Адрес интернет магазина',
                        placeholder: '***',
                        type: 'string',
                        hint: "Нужно заполнить в формате https://ваш-сайт.ru",
                        validationSchema: Yup
                            .string()
                            .matches(
                                /^((ftp|http|https):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/,
                                "Некорректный URL сайта. Нужно заполнить в формате https://ваш-сайт.ru"
                            ),
                        notDisabled: true
                    },
                    {
                        name: "phone",
                        title: 'Номер телефона',
                        placeholder: '7 (987) 654-32-10',
                        type: 'phone',
                        validationSchema: Yup.string().required('Обязательно к заполнению'),
                        notDisabled: true
                    },
                    {
                        name: "email",
                        title: 'Почта',
                        placeholder: '***',
                        type: 'string',
                        validationSchema: Yup.string().email('Неправильно введен Email').required('Обязательно к заполнению'),
                        notDisabled: true
                    }
                ]
            },
            {
                title: "Юридический адрес",
                items: [
                    {
                        name: "addresses.legal.country",
                        title: 'Страна',
                        placeholder: 'Россия',
                        type: 'string',
                        isGlobalDisabled: true,
                        validationSchema: Yup.string().min(3, 'Минимум 3 символа').required('Заполните поле'),
                    },
                    {
                        name: "addresses.legal.city",
                        title: 'Город или населенный пункт',
                        placeholder: 'Екатеринбург',
                        type: 'string',
                        isGlobalDisabled: true,
                        validationSchema: Yup.string().min(3, 'Минимум 3 символа').required('Заполните поле'),
                    },
                    {
                        name: "addresses.legal.street",
                        title: 'Улица, дом, корпус, квартира, офис и т.д.',
                        placeholder: 'Ленина ',
                        type: 'string',
                        isGlobalDisabled: true,
                        validationSchema: Yup.string().min(3, 'Минимум 3 символа').required('Заполните поле'),
                    },
                    {
                        name: "addresses.legal.zip",
                        title: 'Индекс адреса',
                        placeholder: '620000',
                        type: 'string',
                        isGlobalDisabled: true,
                        validationSchema: Yup
                            .string()
                            .required('Обязательно к заполнению')
                            .matches(
                                /^[0-9]{5}.$/,
                                "Почтовый индекс должен состоять из 6 цифр"
                            ),
                    }
                ]
            },
            {
                title: "",
                items: []
            },
            {
                title: "Почтовый адрес",
                items: [
                    {
                        name: "addresses.mailing.country",
                        title: 'Страна',
                        placeholder: 'Россия',
                        type: 'string',
                        isGlobalDisabled: false,
                    },
                    {
                        name: "addresses.mailing.city",
                        title: 'Город или населенный пункт',
                        placeholder: 'Екатеринбург',
                        type: 'string',
                        isGlobalDisabled: false,
                    },
                    {
                        name: "addresses.mailing.street",
                        title: 'Улица, дом, корпус, квартира, офис и т.д.',
                        placeholder: 'Ленина ',
                        type: 'string',
                        isGlobalDisabled: false,
                    },
                    {
                        name: "addresses.mailing.zip",
                        title: 'Индекс адреса',
                        placeholder: '620000',
                        type: 'string',
                        isGlobalDisabled: false,
                    }
                ]
            },
        ]
    },
    {
        tab: {
            label: "Банк",
            value: "bank"
        },
        sections: [
            {
                title: "Основная информация",
                items: [
                    {
                        name: "bankAccount.name",
                        title: 'Наименование Банка',
                        placeholder: 'Звездочка',
                        type: 'string',
                        validationSchema: Yup.string().required('Обязательно к заполнению'),
                        isGlobalDisabled: false,
                    },
                    {
                        name: "bankAccount.bik",
                        title: 'БИК Банка',
                        placeholder: '123456789',
                        type: 'string',
                        isGlobalDisabled: false,
                        validationSchema: Yup
                            .string()
                            .matches(
                                /^[0-9]{8}.$/,
                                "БИК банка должен состоять из 9 цифр"
                            )
                            .required('Обязательно к заполнению')
                    },
                    {
                        name: "bankAccount.korAccount",
                        title: 'Кор. счет Банка',
                        placeholder: '****',
                        type: 'string',
                        validationSchema: Yup
                            .string()
                            .matches(
                                /^[0-9]{19}.$/,
                                "Корреспондентский счет должен состоять из 20 цифр"
                            )
                            .required('Обязательно к заполнению'),
                        isGlobalDisabled: false,
                    },
                    {
                        name: "bankAccount.account",
                        title: 'Расчетный счет',
                        placeholder: '****',
                        type: 'string',
                        validationSchema: Yup
                            .string()
                            .required('Обязательно к заполнению')
                            .matches(
                                /^[0-9]{19}.$/,
                                "Расчетный счет должен состоять из 20 цифр"
                            ),
                        isGlobalDisabled: false,
                    }
                ]
            }
        ]
    },
    {
        tab: {
            label: "Руководитель",
            value: "seo"
        },
        sections: [
            {
                title: "Основная информация",
                items: [
                    {
                        name: "ceo.lastName",
                        title: 'Фамилия руководителя',
                        placeholder: '***',
                        type: 'string',
                        validationSchema: Yup.string().required('Обязательно к заполнению'),
                    },
                    {
                        name: "ceo.firstName",
                        title: 'Имя руководителя',
                        placeholder: '***',
                        type: 'string',
                        validationSchema: Yup.string().required('Обязательно к заполнению'),
                    },
                    {
                        name: "ceo.middleName",
                        title: 'Отчество руководителя',
                        placeholder: '***',
                        type: 'string'
                    },
                    {
                        name: "ceo.address",
                        title: 'Адрес регистрации/адрес проживания руководителя',
                        placeholder: 'Екатеринбург, ул. Ленина д. 1 кв. 1',
                        type: 'address',
                        validationSchema: Yup.string().required('Обязательно к заполнению'),
                    },
                    {
                        name: "ceo.dob",
                        title: 'Дата рождения руководителя',
                        placeholder: '01.01.2000',
                        type: 'date',
                        validationSchema: Yup
                            .string()
                            .matches(/^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)/i, 'Запишите пожалуйста дату рождения в формате дд.мм.гггг')
                            .test(
                                "ceo.dob",
                                "Вам должно быть больше 18 лет",
                                value => {
                                    value = formatDate(value);
                                    return moment().diff(moment(value),'years') >= 18;
                                })
                            .required('Обязательно к заполнению')
                    },
                    {
                        name: "ceo.pob",
                        title: 'Место рождения руководителя',
                        placeholder: 'Екатеринбург, ул. Ленина д. 1 кв. 1',
                        type: 'address'
                    },
                    {
                        name: "ceo.citizenship",
                        title: 'Гражданство руководителя',
                        placeholder: '***',
                        type: 'string',
                        validationSchema: Yup.string().required('Обязательно к заполнению'),
                    },
                    {
                        notDisabled: true,
                        name: "ceo.phone",
                        title: 'Контактный телефон руководителя',
                        placeholder: '***',
                        type: 'phone',
                        validationSchema: Yup.string().required('Обязательно к заполнению'),
                    }
                ]
            },
            {
                title: "Документы",
                items: [
                    {
                        name: "ceo.document.type",
                        title: 'Наименование документа, удостоверяющего личность',
                        placeholder: '***',
                        type: 'string'
                    },
                    {
                        name: "ceo.document.issueDate",
                        title: 'Дата выдачи документа',
                        placeholder: '01.01.2020',
                        type: 'date',
                        isGlobalDisabled: false,
                        validationSchema: Yup.string().matches(/^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)/i, 'Запишите пожалуйста дату рождения в формате дд.мм.гггг')
                    },
                    {
                        name: "ceo.document.issuedBy",
                        title: 'Кем выдан',
                        placeholder: 'Отделение ...',
                        type: 'string',
                        isGlobalDisabled: false,
                    },
                    {
                        name: "ceo.document.serialNumber",
                        title: 'Серия и номер документа',
                        placeholder: '1122 334455',
                        type: 'string',
                        isGlobalDisabled: false,
                    },
                    {
                        name: "ceo.document.departmentCode",
                        title: 'Код подразделения',
                        placeholder: '111-222',
                        type: 'string',
                        isGlobalDisabled: false,
                    }
                ]
            },
        ]
    }
]

export default ip
