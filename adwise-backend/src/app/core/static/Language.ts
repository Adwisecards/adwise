interface ILanguage {
    [key: string]: boolean
}

/**
 * Language provides static language list
 */
class Language {
    private static readonly list: ILanguage = {
        'ru': true,
        'en': true
    };

    public static getList(): (keyof ILanguage)[] {
        return Object.keys(Language.list);
    }

    public static isValid(language: string): boolean {
        return !!Language.list[language];
    }
}

export default Language;