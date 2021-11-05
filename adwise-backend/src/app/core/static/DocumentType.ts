interface IDocumentType {
    [key: string]: boolean
};

/**
 * DocumentType provides static DocumentType list
 */
class DocumentType {
    private static readonly list: IDocumentType = {
        'business': true,
        'cards': true,
        'crm': true
    };

    public static getList(): (keyof IDocumentType)[] {
        return Object.keys(DocumentType.list);
    }

    public static isValid(documentType: string): boolean {
        return !!DocumentType.list[documentType];
    }
}

export default DocumentType;