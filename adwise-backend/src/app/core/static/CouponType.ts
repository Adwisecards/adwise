interface ICouponType {
    [key: string]: boolean
}

/**
 * CouponType provides static CouponType list
 */
class CouponType {
    private static readonly list: ICouponType = {
        'service': true,
        'product': true
    };

    public static getList(): (keyof ICouponType)[] {
        return Object.keys(CouponType.list);
    }

    public static isValid(couponType: string): boolean {
        return !!CouponType.list[couponType];
    }
}

export default CouponType;