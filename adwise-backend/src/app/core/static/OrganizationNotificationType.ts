interface IOrganizationNotificationType {
    [key: string]: boolean
}

/**
 * OrganizationNotificationType provides static OrganizationNotificationType list
 */
class OrganizationNotificationType {
    private static readonly list: IOrganizationNotificationType = {
        'purchaseConfirmed': true,
        'couponExpired': true,
        'legalInfoRequestRejected': true,
        'legalInfoRequestSatisfied': true,
        'lowDeposit': true,
        'purchaseIncomplete': true
    };

    public static getList(): (keyof IOrganizationNotificationType)[] {
        return Object.keys(OrganizationNotificationType.list);
    }

    public static isValid(organizationNotificationType: string): boolean {
        return !!OrganizationNotificationType.list[organizationNotificationType];
    }
}

export default OrganizationNotificationType;