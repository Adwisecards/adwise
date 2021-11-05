interface IUserRole {
    [key: string]: boolean
};

/**
 * UserRole provides static UserRole list
 */
class UserRole {
    private static readonly list: IUserRole = {
        'manager': true,
        'business': true,
        'common': true
    };

    public static getList(): (keyof IUserRole)[] {
        return Object.keys(UserRole.list);
    }

    public static isValid(userRole: string): boolean {
        return !!UserRole.list[userRole];
    }
}

export default UserRole;