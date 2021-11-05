interface IUserPlatform {
    [key: string]: boolean
};

/**
 * UserPlatform provides static UserPlatform list
 */
class UserPlatform {
    private static readonly list: IUserPlatform = {
        'ios': true,
        'android': true,
        'crm': true
    };

    public static getList(): (keyof IUserPlatform)[] {
        return Object.keys(UserPlatform.list);
    }

    public static isValid(userPlatform: string): boolean {
        return !!UserPlatform.list[userPlatform];
    }
}

export default UserPlatform;