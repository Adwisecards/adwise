interface IOrganizationType {
    [key: string]: boolean
}

/**
 * OrganizationType provides static OrganizationType list
 */
class OrganizationType {
    private static readonly list: IOrganizationType = {
        'person': true,
        'company': true
    };

    public static getList(): (keyof IOrganizationType)[] {
        return Object.keys(OrganizationType.list);
    }

    public static isValid(organizationType: string): boolean {
        return !!OrganizationType.list[organizationType];
    }
}

export default OrganizationType;