interface ILogApp {
    [key: string]: boolean
};

/**
 * LogApp provides static LogApp list
 */
class LogApp {
    private static readonly list: ILogApp = {
        'web': true,
        'cards': true,
        'crm': true,
        'business': true
    };

    public static getList(): (keyof ILogApp)[] {
        return Object.keys(LogApp.list);
    }

    public static isValid(logApp: string): boolean {
        return !!LogApp.list[logApp];
    }
}

export default LogApp;