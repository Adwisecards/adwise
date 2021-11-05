interface IBankRequestType {
    [key: string]: boolean
}

/**
 * BankRequestType provides static BankRequestType list
 */
class BankRequestType {
    private static readonly list: IBankRequestType = {
        'card': true
    };

    public static getList(): (keyof IBankRequestType)[] {
        return Object.keys(BankRequestType.list);
    }

    public static isValid(bankRequestType: string): boolean {
        return !!BankRequestType.list[bankRequestType];
    }
}

export default BankRequestType;