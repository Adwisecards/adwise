interface ITransactionOrigin {
    [key: string]: boolean
}

/**
 * TransactionOrigin provides static TransactionOrigin list
 */
class TransactionOrigin {
    private static readonly list: ITransactionOrigin = {
        'online': true,
        'cash': true,
        'split': true,
        'safe': true
    };

    public static getList(): (keyof ITransactionOrigin)[] {
        return Object.keys(TransactionOrigin.list);
    }

    public static isValid(transactionOrigin: string): boolean {
        return !!TransactionOrigin.list[transactionOrigin];
    }

    // public static translate(type: string, lang: string): string {
    //     switch (lang) {
    //         case 'ru':
    //         default:
    //             return (<any>this.ruTranslation)[type];
    //     }
    // }
}

export default TransactionOrigin;