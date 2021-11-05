interface IAgeRestricted {
    [key: string]: boolean
}

/**
 * AgeRestricted provides static AgeRestricted list
 */
class AgeRestricted {
    private static readonly list: IAgeRestricted = {
        'cigarettes': true,
        'alcohol': true
    };

    public static getList(): (keyof IAgeRestricted)[] {
        return Object.keys(AgeRestricted.list);
    }

    public static isValid(ageRestricted: string): boolean {
        return !!AgeRestricted.list[ageRestricted];
    }
}

export default AgeRestricted;