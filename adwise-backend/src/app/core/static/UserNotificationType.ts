interface IUserNotificationType {
    [key: string]: boolean
}

/**
 * UserNotificationType provides static UserNotificationType list
 */
class UserNotificationType {
    private static readonly list: IUserNotificationType = {
        'purchaseConfirmed': true,
        'purchaseCompleted': true,
        'purchaseCreated': true,
        'employeeCreated': true,
        'contactRequestAccepted': true
    };

    public static getList(): (keyof IUserNotificationType)[] {
        return Object.keys(UserNotificationType.list);
    }

    public static isValid(userNotificationType: string): boolean {
        return !!UserNotificationType.list[userNotificationType];
    }
}

export default UserNotificationType;