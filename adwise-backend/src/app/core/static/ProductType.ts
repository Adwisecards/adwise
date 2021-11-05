interface IOrganizationType {
    [key: string]: boolean
}

/**
 * OrganizationType provides static OrganizationType list
 */
class OrganizationType {
    private static readonly list: IOrganizationType = {
        'service': true,
        'goods': true
    };

    public static getList(): (keyof IOrganizationType)[] {
        return Object.keys(OrganizationType.list);
    }

    public static isValid(productType: string): boolean {
        return !!OrganizationType.list[productType];
    }
}

export default OrganizationType;