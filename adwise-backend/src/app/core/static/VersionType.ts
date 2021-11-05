interface IVersionType {
    [key: string]: boolean
};

/**
 * VersionType provides static VersionType list
 */
class VersionType {
    private static readonly list: IVersionType = {
        'business': true,
        'crm': true,
        'cards': true
    };

    public static getList(): (keyof IVersionType)[] {
        return Object.keys(VersionType.list);
    }

    public static isValid(versionType: string): boolean {
        return !!VersionType.list[versionType];
    }
}

export default VersionType;