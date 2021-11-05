interface ILegalFormInfo {
    [key: string]: string[];
}

/**
 * LegalFormInfo provides static LegalFormInfo list
 */
class LegalFormInfo {
    private static readonly list: ILegalFormInfo = {
        'ip': [
            'name',
            'fullName',
            'billingDescriptor',
            'dob',
            'placeOfBirth',
            'citizenship',
            'inn',
            'ogrnip',
            'ogrn',
            'kpp',
            'phoneNumber',
            'email',
            'siteUrl',
            'identityDocument',
            'identityDocumentSerialNumber',
            'identityDocumentDateIssue',
            'identityDocumentIssuedBy',
            'identityDocumentDepartmentCode',
            'addresses_city',
            'addresses_street',
            'addresses_zip',
            'mailingAddress',
            'mailingAddressIndex',
            'bankAccount_bankName',
            'bankAccount_bik',
            'bankAccount_korAccount',
            'bankAccount_account',
            'ceoLastName',
            'ceoFirstName',
            'ceoMiddleName',
            'ceoCitizenship',
            'ceoBirthDate',
            'ceoBirthPlace',
            'ceoDocNumber',
            'ceoIssueDate',
            'ceoIssuedBy',
            'ceoAddress',
            'ceoPhone',
            'organizationName',
            'location',
            'locationIndex',
            'addresses',
            'addresses_type',
            'addresses_country',
            'ceoDocType',
            'founderDocType',
            'founderLastName',
            'founderFirstName',
            'founderMiddleName',
            'founderAddress',
            'founderCitizenship',
            'founderBirthDate',
            'founderBirthPlace',
            'founderDocNumber',
            'founderIssueDate',
            'founderIssuedBy',
            'founderPhone',
            'emailAddress',
            'residenceAddress',
            'residenceAddressIndex',
            'ceo',
            'bankAccount',
            'phones'
        ],
        'ooo': [

        ],
        'individual': [

        ]
    };

    public static getList(legalForm: string): (keyof ILegalFormInfo)[] {
        return this.list[legalForm];
    }
}

export default LegalFormInfo;