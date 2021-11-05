interface IPointType {
    [key: string]: boolean
}

/**
 * PointType provides static PointType list
 */
class PointType {
    private static readonly list: IPointType = {
        'cashback': true,
        'bonus': true,
        'points': true
    };

    public static getList(): (keyof IPointType)[] {
        return Object.keys(PointType.list);
    }

    public static isValid(pointType: string): boolean {
        return !!PointType.list[pointType];
    }
}

export default PointType;