interface IContactType {
    [key: string]: boolean
}

/**
 * ContactType provides static ContactType list
 */
class ContactType {
    private static readonly list: IContactType = {
        'personal': true,
        'work': true,
        'manager': true
    };

    public static getList(): (keyof IContactType)[] {
        return Object.keys(ContactType.list);
    }

    public static isValid(contactType: string): boolean {
        return !!ContactType.list[contactType];
    }
}

export default ContactType;