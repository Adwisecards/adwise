interface IUserNotificationLevel {
    [key: string]: boolean
}

/**
 * UserNotificationLevel provides static UserNotificationLevel list
 */
class UserNotificationLevel {
    private static readonly list: IUserNotificationLevel = {
        'info': true,
        'success': true,
        'warning': true,
        'danger': true
    };

    public static getList(): (keyof IUserNotificationLevel)[] {
        return Object.keys(UserNotificationLevel.list);
    }

    public static isValid(userNotificationLevel: string): boolean {
        return !!UserNotificationLevel.list[userNotificationLevel];
    }
}

export default UserNotificationLevel;