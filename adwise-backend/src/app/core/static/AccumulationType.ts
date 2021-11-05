interface IAccumulationType {
    [key: string]: boolean
}

/**
 * AccumulationType provides static AccumulationType list
 */
class AccumulationType {
    private static readonly list: IAccumulationType = {
        'purchase': true,
        'tips': true
    };

    public static getList(): (keyof IAccumulationType)[] {
        return Object.keys(AccumulationType.list);
    }

    public static isValid(accumulationType: string): boolean {
        return !!AccumulationType.list[accumulationType];
    }
}

export default AccumulationType;