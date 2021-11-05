interface ICouponDocumentType {
    [key: string]: boolean
}

/**
 * CouponDocumentType provides static CouponDocumentType list
 */
class CouponDocumentType {
    private static readonly list: ICouponDocumentType = {
        'terms': true
    };

    public static getList(): (keyof ICouponDocumentType)[] {
        return Object.keys(CouponDocumentType.list);
    }

    public static isValid(couponDocumentType: string): boolean {
        return !!CouponDocumentType.list[couponDocumentType];
    }
}

export default CouponDocumentType;