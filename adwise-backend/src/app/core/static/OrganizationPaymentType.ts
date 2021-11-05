interface IOrganizationPaymentType {
    [key: string]: boolean
}

/**
 * OrganizationPaymentType provides static OrganizationPaymentType list
 */
class OrganizationPaymentType {
    private static readonly list: IOrganizationPaymentType = {
        'default': true,
        'split': true,
        'safe': true
    };

    public static getList(): (keyof IOrganizationPaymentType)[] {
        return Object.keys(OrganizationPaymentType.list);
    }

    public static isValid(organizationPaymentType: string): boolean {
        return !!OrganizationPaymentType.list[organizationPaymentType];
    }
}

export default OrganizationPaymentType;