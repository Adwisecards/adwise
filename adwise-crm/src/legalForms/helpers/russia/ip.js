
import moment from "moment";
import {formatDate} from "../../../helper/format";

// Конвертация формы для отправки на backend
const getBodyFromForm = (organization) => {
    const info = organization?.legal?.info || {};
    const date = new Date();

    let body = {
        organizationName: info?.organizationName || '',
        billingDescriptor: info?.billingDescriptor || '',
        inn: info?.inn || '',
        ogrn: info?.ogrn || '',
        kpp: info?.kpp || '000000000',
        siteUrl: info?.siteUrl || '',
        phone: (info?.phone || '').replace(/\D+/g,""),
        email: info?.email || '',
        addresses: {
            legal: {
                country: info?.['addresses.legal.country'] || '',
                city: info?.['addresses.legal.city'] || '',
                street: info?.['addresses.legal.street'] || '',
                zip: info?.['addresses.legal.zip'] || '',
            },
            mailing: {
                country: info?.['addresses.mailing.country'] || '',
                city: info?.['addresses.mailing.city'] || '',
                street: info?.['addresses.mailing.street'] || '',
                zip: info?.['addresses.mailing.zip'] || '',
            },
        },
        bankAccount: {
            account: info?.['bankAccount.account'] || '',
            name: info?.['bankAccount.name'] || '',
            bik: info?.['bankAccount.bik'] || '',
            korAccount: info?.['bankAccount.korAccount'] || '',
        },
        ceo: {
            firstName: info?.['ceo.firstName'] || '',
            lastName: info?.['ceo.lastName'] || '',
            middleName: info?.['ceo.middleName'] || '',
            address: info?.['ceo.address'] || '',
            dob: formatDate(info?.['ceo.dob'] || ''),
            pob: info?.['ceo.pob'] || '',
            citizenship: info?.['ceo.citizenship'] || '',
            phone: (info?.['ceo.phone'] || '').replace(/\D+/g,""),
            document: {
                type: info?.['ceo.document.type'] || '',
                issueDate: formatDate(info?.['ceo.document.issueDate'] || ''),
                issuedBy: info?.['ceo.document.issuedBy'] || '',
                serialNumber: info?.['ceo.document.serialNumber'] || '',
                departmentCode: info?.['ceo.document.departmentCode'] || '',
            }
        }
    }

    return body

}

// Конвертация тела от API для работы в системе
const getFormFromBody = (organization, legal) => {
    const info = legal?.info || {};
    const date = null;

    let body = {
        organizationName: info?.organizationName || '',
        billingDescriptor: info?.billingDescriptor || '',
        inn: info?.inn || '',
        ogrn: info?.ogrn || '',
        kpp: info?.kpp || '000000000',
        siteUrl: info?.siteUrl || '',
        phone: info?.phone || '',
        email: info?.email || '',

        'addresses.legal.country': info?.addresses?.legal?.country || '',
        'addresses.legal.city': info?.addresses?.legal?.city || '',
        'addresses.legal.street': info?.addresses?.legal?.street || '',
        'addresses.legal.zip': info?.addresses?.legal?.zip || '',

        'addresses.mailing.country': info?.addresses?.mailing?.country || '',
        'addresses.mailing.city': info?.addresses?.mailing?.city || '',
        'addresses.mailing.street': info?.addresses?.mailing?.street || '',
        'addresses.mailing.zip': info?.addresses?.mailing?.zip || '',

        'bankAccount.account': info?.bankAccount?.account || '',
        'bankAccount.name': info?.bankAccount?.name || '',
        'bankAccount.bik': info?.bankAccount?.bik || '',
        'bankAccount.korAccount': info?.bankAccount?.korAccount || '',

        'ceo.firstName': info?.ceo?.firstName || '',
        'ceo.lastName': info?.ceo?.lastName || '',
        'ceo.middleName': info?.ceo?.middleName || '',
        'ceo.address': info?.ceo?.address || '',
        'ceo.dob': Boolean(info?.ceo?.dob) ? moment(info?.ceo?.dob).format('DD.MM.YYYY') : null,
        'ceo.pob': info?.ceo?.pob || '',
        'ceo.citizenship': info?.ceo?.citizenship || '',
        'ceo.phone': info?.ceo?.phone || '',
        'ceo.document.type': info?.ceo?.document?.type || '',
        'ceo.document.issueDate': Boolean(info?.ceo?.document?.issueDate) ? moment(info?.ceo?.document?.issueDate).format('DD.MM.YYYY') : null,
        'ceo.document.issuedBy': info?.ceo?.document?.issuedBy,
        'ceo.document.serialNumber': info?.ceo?.document?.serialNumber,
        'ceo.document.departmentCode': info?.ceo?.document?.departmentCode,
    }

    return body
}

const formNameRussiaIp = {
    organizationName: 'Наименование организации',
    inn: 'ИНН',
    ogrn: 'ОГРНИП',
    siteUrl: 'Адрес интернет магазина',
    phone: 'Номер телефона',
    email: 'Почта',
    citizenship: 'Гражданство',
    dob: 'Дата рождения',
    pob: 'Место рождения',

    'document.type': 'Наименование документа, удостоверяющего личность',
    'document.issueDate': 'Дата выдачи документа',
    'document.issuedBy': 'Кем выдан',
    'document.serialNumber': 'Серия и номер документа',
    'document.departmentCode': 'Код подразделения',

    'addresses.legal.country': 'Страна',
    'addresses.legal.city': 'Город или населенный пункт',
    'addresses.legal.street': 'Улица, дом, корпус, квартира, офис и т.д.',
    'addresses.legal.zip': 'Индекс адреса',

    'addresses.mailing.country': 'Страна',
    'addresses.mailing.city': 'Город или населенный пункт',
    'addresses.mailing.street': 'Улица, дом, корпус, квартира, офис и т.д.',
    'addresses.mailing.zip': 'Индекс адреса',

    'bankAccount.account': 'Расчетный счет',
    'bankAccount.name': 'Наименование Банка',
    'bankAccount.bik': 'БИК Банка',
    'bankAccount.korAccount': 'Кор. счет Банка',

    'ceo.firstName': 'Имя руководителя',
    'ceo.lastName': 'Фамилия руководителя',
    'ceo.middleName': 'Отчество руководителя',
    'ceo.address': 'Адрес регистрации/адрес проживания руководителя',
    'ceo.dob': 'Дата рождения руководителя',
    'ceo.pob': 'Место рождения руководителя',
    'ceo.citizenship': 'Гражданство руководителя',
    'ceo.phone': 'Контактный телефон руководителя',
    'ceo.document.type': 'Наименование документа, удостоверяющего личность',
    'ceo.document.issueDate': 'Дата выдачи документа',
    'ceo.document.issuedBy': 'Кем выдан',
    'ceo.document.serialNumber': 'Серия и номер документа',
    'ceo.document.departmentCode': 'Код подразделения',
}

export {
    getBodyFromForm,
    getFormFromBody,
    formNameRussiaIp
}
