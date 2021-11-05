interface IChatType {
    [key: string]: boolean
}

/**
 * ChatType provides static ChatType list
 */
class ChatType {
    private static readonly list: IChatType = {
        'user': true,
        'organization': true,
        'support': true
    };

    public static getList(): (keyof IChatType)[] {
        return Object.keys(ChatType.list);
    }

    public static isValid(chatType: string): boolean {
        return !!ChatType.list[chatType];
    }
}

export default ChatType;