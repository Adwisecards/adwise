import { IUser } from "./User";

export interface IUserTreeNode {
    user: IUser;
    parent?: IUserTreeNode;
    children: IUserTreeNode[];
};

export class UserTreeNode implements IUserTreeNode {
    public user: IUser;
    public children: IUserTreeNode[] = [];
    public parent?: IUserTreeNode;

    constructor(user: IUser, children: IUserTreeNode[], parent?: IUserTreeNode) {
        this.user = user;
        this.children = children;
        this.parent = parent;
    }
}