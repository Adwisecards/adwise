interface ICountryLegalForm {
    [key: string]: string[];
}

/**
 * CountryLegalForm provides static countryLegalForm list
 */
class CountryLegalForm {
    private static readonly list: ICountryLegalForm = {
        'rus': [
            'ip',
            'ooo',
            'individual'
        ]
    };

    public static getList(country: string): (keyof ICountryLegalForm)[] {
        return this.list[country];
    }
}

export default CountryLegalForm;