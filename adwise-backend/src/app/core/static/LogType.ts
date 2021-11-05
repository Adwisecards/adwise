interface ILogType {
    [key: string]: boolean
}

/**
 * LogType provides static LogType list
 */
class LogType {
    private static readonly list: ILogType = {
        'purchaseCreated': true,
        'purchaseConfirmed': true,
        'contactRequestCreated': true,
        'refSubscribed': true
    };

    public static getList(): (keyof ILogType)[] {
        return Object.keys(LogType.list);
    }

    public static isValid(logType: string): boolean {
        return !!LogType.list[logType];
    }
}

export default LogType;