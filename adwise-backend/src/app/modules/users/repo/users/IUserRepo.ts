import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IUser } from "../../models/User";

export interface IUserRepo extends IRepo<IUser> {
    findByPhone(phone: string): RepoResult<IUser>;
    findByEmail(email: string): RepoResult<IUser>;
    findByWinwiseId(id: string): RepoResult<IUser>;
    findByWallet(walletId: string): RepoResult<IUser>;
    findByParent(parentId: string): RepoResult<IUser[]>;
    findByPushToken(pushToken: string): RepoResult<IUser>;
    findByPushTokenBusiness(pushTokenBusiness: string): RepoResult<IUser>;
    findByDeviceToken(deviceToken: string): RepoResult<IUser>;
    findByDeviceTokenBusiness(deviceTokenBusiness: string): RepoResult<IUser>;
    findByRefCode(refCode: string): RepoResult<IUser>;
    getUserTree(userId: string): RepoResult<IUser>;
};