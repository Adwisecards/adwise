interface IOfferType {
    [key: string]: boolean
}

/**
 * OfferType provides static OfferType list
 */
class OfferType {
    private static readonly list: IOfferType = {
        'cashback': true,
        'points': true
    };

    public static getList(): (keyof IOfferType)[] {
        return Object.keys(OfferType.list);
    }

    public static isValid(offerType: string): boolean {
        return !!OfferType.list[offerType];
    }
}

export default OfferType;