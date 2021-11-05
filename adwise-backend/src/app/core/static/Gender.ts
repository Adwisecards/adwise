interface IGender {
    [key: string]: boolean
}

/**
 * Gender provides static gender list
 */
class Gender {
    private static readonly list: IGender = {
        'female': true,
        'male': true,
        'other': true
    };

    public static getList(): (keyof IGender)[] {
        return Object.keys(Gender.list);
    }

    public static isValid(gender: string): boolean {
        return !!Gender.list[gender];
    }
}

export default Gender;