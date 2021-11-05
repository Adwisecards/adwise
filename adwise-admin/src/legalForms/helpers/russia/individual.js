// Конвертация формы для отправки на backend
import moment from "moment";

// Конвертация тела от API для работы в системе
const getFormFromBody = (organization, legal) => {
    const info = legal?.info || {};
    const date = new Date();

    let body = {
        organizationName: info?.organizationName || '',
        inn: info?.inn || '',
        ogrn: info?.ogrn || '',
        siteUrl: organization?.website || '',
        phone: info?.phone || '',
        email: info?.email || '',
        citizenship: info?.citizenship || '',
        dob: moment(info?.dob).format('DD.MM.YYYY'),
        pob: info?.pob || '',

        'document.type': info?.document?.type || '',
        'document.issueDate': moment(info?.document?.issueDate).format('DD.MM.YYYY'),
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

export {
    getFormFromBody
}
