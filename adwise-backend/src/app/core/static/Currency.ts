interface ICurrency {
    [key: string]: boolean
}

/**
 * Currency provides static currency list
 */
class Currency {
    private static readonly list: ICurrency = {
        'eur': true,
        'gbp': true,
        'rub': true,
        'idr': true,
        'jpy': true,
        'krw': true,
        'pte': true,
        'tpe': true,
        'try': true,
        'cny': true,
        'vnd': true,
        'usd': true
    };

    public static getList(): (keyof ICurrency)[] {
        return Object.keys(Currency.list);
    }

    public static isValid(currency: string): boolean {
        return !!Currency.list[currency];
    }
}

export default Currency;