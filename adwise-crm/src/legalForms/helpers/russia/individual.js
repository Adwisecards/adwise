
// Конвертация формы для отправки на backend
import moment from "moment";
import {formatDate} from "../../../helper/format";

const getBodyFromForm = (organization) => {
    const info = organization?.legal?.info || {};
    const date = new Date();

    let body = {
        organizationName: info?.organizationName || '',
        inn: info?.inn || '',
        ogrn: info?.ogrn || '',
        siteUrl: organization?.website || '',
        phone: (info?.phone || '').replace(/\D+/g,""),
        email: info?.email || '',
        citizenship: info?.citizenship || '',
        dob: moment(formatDate(info?.dob) || date).format('YYYY-MM-DD'),
        pob: info?.pob || '',
        document: {
            type: info?.['document.type'] || '',
            issueDate: moment(formatDate(info?.['document.issueDate']) || date).format('YYYY-MM-DD'),
            issuedBy: info?.['document.issuedBy'] || '',
            serialNumber: info?.['document.serialNumber'],
            departmentCode: info?.['document.departmentCode'],
        },
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
            korAccount: info?.['bankAccount.korAccount'],
        }
    };

    return body

}

// Конвертация тела от API для работы в системе
const getFormFromBody = (organization, legal) => {
    const info = legal?.info || {};
    const date = null;

    let body = {
        organizationName: info?.organizationName || '',
        inn: info?.inn || '',
        ogrn: info?.ogrn || '',
        siteUrl: organization?.website || '',
        phone: info?.phone || '',
        email: info?.email || '',
        citizenship: info?.citizenship || '',
        dob: Boolean(info?.dob) ? moment(info?.dob).format('DD.MM.YYYY') : null,
        pob: info?.pob || '',

        'document.type': info?.document?.type || '',
        'document.issueDate': Boolean(info?.document?.issueDate) ? moment(info?.document?.issueDate).format('DD.MM.YYYY') : null,
        'document.issuedBy': info?.document?.issuedBy || '',
        'document.serialNumber': info?.document?.serialNumber || '',
        'document.departmentCode': info?.document?.departmentCode || '',

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
        'bankAccount.korAccount': info?.bankAccount?.korAccount || ''
    };

    return body
}

const formNameRussiaIndividual = {
    organizationName: 'Название организации',
    inn: 'Инн',
    ogrn: 'ОГРН',
    siteUrl: 'Сайт',
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
}

export {
    getBodyFromForm,
    getFormFromBody,

    formNameRussiaIndividual
}
