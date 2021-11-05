interface ILogPlatform {
    [key: string]: boolean
};

/**
 * LogPlatform provides static LogPlatform list
 */
class LogPlatform {
    private static readonly list: ILogPlatform = {
        'ios': true,
        'android': true,
        'pc': true
    };

    public static getList(): (keyof ILogPlatform)[] {
        return Object.keys(LogPlatform.list);
    }

    public static isValid(logPlatform: string): boolean {
        return !!LogPlatform.list[logPlatform];
    }
}

export default LogPlatform;