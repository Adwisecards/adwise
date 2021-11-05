interface IPurchaseType {
    [key: string]: boolean
}

/**
 * PurchaseType provides static PurchaseType list
 */
class PurchaseType {
    private static readonly list: IPurchaseType = {
        'cash': true,
        'cashless': true
    };

    public static getList(): (keyof IPurchaseType)[] {
        return Object.keys(PurchaseType.list);
    }

    public static isValid(purchaseType: string): boolean {
        return !!PurchaseType.list[purchaseType];
    }
}

export default PurchaseType;