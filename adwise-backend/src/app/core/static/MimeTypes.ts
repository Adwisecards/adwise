interface IMimeType {
    [key: string]: string;
}

/**
 * MimeType provides static MimeType list
 */
class MimeType {
    private static readonly list: IMimeType = {
        'application/pdf': 'pdf',
        'image/png': 'png',
        'image/jpg': 'jpg',
        'image/jpeg': 'jpeg',
        'image/gif': 'gif',
        'image/svg+xml': 'svg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/msword': 'doc'
    };

    public static getList(): (keyof IMimeType)[] {
        return Object.keys(MimeType.list);
    }

    public static isValid(mimeType: string): boolean {
        return !!MimeType.list[mimeType];
    }

    public static getExtension(mimeType: string): string {
        return MimeType.list[mimeType];
    }
}

export default MimeType;