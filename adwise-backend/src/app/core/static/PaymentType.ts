interface IPaymentType {
    [key: string]: boolean
}

/**
 * PaymentType provides static PaymentType list
 */
class PaymentType {
    private static readonly list: IPaymentType = {
        'packet': true,
        'purchase': true,
        'deposit': true,
        'tips': true
    };

    public static getList(): (keyof IPaymentType)[] {
        return Object.keys(PaymentType.list);
    }

    public static isValid(paymentType: string): boolean {
        return !!PaymentType.list[paymentType];
    }
}

export default PaymentType;