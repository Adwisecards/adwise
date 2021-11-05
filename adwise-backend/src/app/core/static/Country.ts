interface ICountry {
    [key: string]: boolean
}

/**
 * Country provides static country list
 */
class Country {
    private static readonly list: ICountry = {
        'rus': true
    };

    public static getList(): (keyof ICountry)[] {
        return Object.keys(Country.list);
    }

    public static isValid(country: string): boolean {
        return !!Country.list[country];
    }
}

export default Country;