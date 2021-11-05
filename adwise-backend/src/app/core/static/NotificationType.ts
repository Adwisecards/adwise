interface INotificationType {
    [key: string]: boolean
}

/**
 * NotificationType provides static NotificationType list
 */
class NotificationType {
    private static readonly list: INotificationType = {
        'contactRequestCreated': true,
        'contactRequestAccepted': true,
        'taskCreated': true,
        'purchaseCreated': true,
        'purchaseConfirmed': true,
        'purchaseConfirmedBusiness': true,
        'refPurchase': true,
        'purchaseCompleted': true,
        'purchaseShared': true,
        'employeeCreated': true,
        'purchaseIncomplete': true,
        'common': true
    };

    public static getList(): (keyof INotificationType)[] {
        return Object.keys(NotificationType.list);
    }

    public static isValid(notificationType: string): boolean {
        return !!NotificationType.list[notificationType];
    }
}

export default NotificationType;