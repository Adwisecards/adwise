interface IUserDocumentType {
    [key: string]: boolean
}

/**
 * UserDocumentType provides static UserDocumentType list
 */
class UserDocumentType {
    private static readonly list: IUserDocumentType = {
        'application': true
    };

    public static getList(): (keyof IUserDocumentType)[] {
        return Object.keys(UserDocumentType.list);
    }

    public static isValid(userDocumentType: string): boolean {
        return !!UserDocumentType.list[userDocumentType];
    }
}

export default UserDocumentType;