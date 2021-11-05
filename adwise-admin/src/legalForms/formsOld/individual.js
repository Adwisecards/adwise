import * as Yup from "yup";
import moment from "moment";
import {formatDate} from "../../helper/format";

const individual = [
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
                        name: 'organizationName',
                        title: 'Наименование организации',
                        placeholder: 'ИП Иванов И.И.',
                        type: 'string',
                        validationSchema: Yup.string().required('Обязательно к заполнению'),
                        isGlobalDisabled: true
                    },
                    {
                        name: 'inn',
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
                        name: 'citizenship',
                        title: 'Гражданство',
                        placeholder: 'Россия',
                        type: 'string',
                        isGlobalDisabled: false,
                        validationSchema: Yup.string().required('Обязательно к заполнению'),
                    },
                    {
                        name: "dob",
                        title: 'Дата рождения',
                        placeholder: '01.01.2000',
                        type: 'date',
                        isGlobalDisabled: false,
                        validationSchema: Yup
                            .string()
                            .matches(/^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)/i, 'Запишите пожалуйста дату рождения в формате дд.мм.гггг')
                            .test(
                                "dob",
                                "Вам должно быть больше 18 лет",
                                value => {
                                    value = formatDate(value);
                                    return moment().diff(moment(value),'years') >= 18;
                                })
                            .required("Обязательно к заполнению")
                    },
                    {
                        name: "pob",
                        title: 'Место рождения',
                        placeholder: 'Екатеринбург, ул. Ленина д. 1 кв. 1',
                        type: 'address',
                        isGlobalDisabled: false,
                    },

                    {
                        name: "document.type",
                        title: 'Наименование документа, удостоверяющего личность',
                        placeholder: 'Паспорт',
                        type: 'string',
                        isGlobalDisabled: false,
                    },
                    {
                        name: "document.serialNumber",
                        title: 'Серия и номер документа',
                        placeholder: '1122 334455',
                        type: 'string',
                        isGlobalDisabled: false,
                    },
                    {
                        name: "document.issueDate",
                        title: 'Дата выдачи документа',
                        placeholder: '01.01.2020',
                        type: 'date',
                        isGlobalDisabled: false,
                        validationSchema: Yup.string().matches(/^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)/i, 'Запишите пожалуйста дату рождения в формате дд.мм.гггг')
                    },
                    {
                        name: "document.issuedBy",
                        title: 'Кем выдан',
                        placeholder: 'Отделение ...',
                        type: 'string',
                        isGlobalDisabled: false,
                    },
                    {
                        name: "document.departmentCode",
                        title: 'Код подразделения',
                        placeholder: '111-222',
                        type: 'string',
                        isGlobalDisabled: false,
                    },
                    {
                        name: "phone",
                        title: 'Номер телефона',
                        placeholder: '7 (987) 654-32-10',
                        type: 'phone',
                        isGlobalDisabled: false,
                        validationSchema: Yup.string().required('Обязательно к заполнению')
                    },
                    {
                        name: "email",
                        title: 'Почта',
                        placeholder: '***',
                        type: 'string',
                        isGlobalDisabled: false,
                        validationSchema: Yup.string().email('Неправильно введен Email').required('Обязательно к заполнению')
                    },
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
            label: "Банковская карта",
            value: "bank_card"
        },
        sections: [
            {
                items: [
                    {
                        name: "bank_card",
                        title: 'Банковская карта',
                        type: 'bank-card'
                    }
                ]
            }
        ]
    },
]

export default individual
