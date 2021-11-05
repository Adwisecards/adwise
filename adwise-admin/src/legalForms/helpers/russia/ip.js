
import moment from "moment";

// Конвертация тела от API для работы в системе
const getFormFromBody = (organization, legal) => {
    const info = legal?.info || {};

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
        'ceo.dob': moment(info?.ceo?.dob).format('DD.MM.YYYY'),
        'ceo.pob': info?.ceo?.pob || '',
        'ceo.citizenship': info?.ceo?.citizenship || '',
        'ceo.phone': info?.ceo?.phone || '',
        'ceo.document.type': info?.ceo?.document?.type || '',
        'ceo.document.issueDate': moment(info?.ceo?.document?.issueDate).format('DD.MM.YYYY'),
        'ceo.document.issuedBy': info?.ceo?.document?.issuedBy,
        'ceo.document.serialNumber': info?.ceo?.document?.serialNumber,
        'ceo.document.departmentCode': info?.ceo?.document?.departmentCode,
    }

    return body
}

export {
    getFormFromBody
}
