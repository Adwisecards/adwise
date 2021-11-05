import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IUserNotification } from "../../models/UserNotification";

export interface IUserNotificationRepo extends IRepo<IUserNotification> {
    findManyByUserAndSeen(userId: string, seen: boolean, limit: number, page: number, populate?: string): RepoResult<IUserNotification[]>;
    updateManySeenByIds(userNotificationIds: string[], seen: boolean): RepoResult<boolean>;
};