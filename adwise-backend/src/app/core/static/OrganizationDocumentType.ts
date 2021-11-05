interface IOrganizationDocumentType {
    [key: string]: boolean
}

/**
 * OrganizationDocumentType provides static OrganizationDocumentType list
 */
class OrganizationDocumentType {
    private static readonly list: IOrganizationDocumentType = {
        'application': true,
        'packetPaymentAct': true,
        'treaty': true,
        'financialReport': true,
        'withdrawalAct': true
    };

    public static getList(): (keyof IOrganizationDocumentType)[] {
        return Object.keys(OrganizationDocumentType.list);
    }

    public static isValid(organizationDocumentType: string): boolean {
        return !!OrganizationDocumentType.list[organizationDocumentType];
    }
}

export default OrganizationDocumentType;