interface IInvitationType {
    [key: string]: boolean
}

/**
 * InvitationType provides static InvitationType list
 */
class InvitationType {
    private static readonly list: IInvitationType = {
        'parent': true,
        'following': true,
        'invitation': true,
        'employee': true
    };

    public static getList(): (keyof IInvitationType)[] {
        return Object.keys(InvitationType.list);
    }

    public static isValid(invitationType: string): boolean {
        return !!InvitationType.list[invitationType];
    }
}

export default InvitationType;