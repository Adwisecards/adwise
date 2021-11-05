interface IMediaType {
    [key: string]: boolean
}

/**
 * MediaType provides static MediaType list
 */
class MediaType {
    private static readonly list: IMediaType = {
        'image': true,
        'video': true
    };

    public static getList(): (keyof IMediaType)[] {
        return Object.keys(MediaType.list);
    }

    public static isValid(mediaType: string): boolean {
        return !!MediaType.list[mediaType];
    }
}

export default MediaType;