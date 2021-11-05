import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IUserNotification, IUserNotificationModel } from "../../../models/UserNotification";
import { IUserNotificationRepo } from "../IUserNotificationRepo";

export class UserNotificationRepo extends Repo<IUserNotification, IUserNotificationModel> implements IUserNotificationRepo {
    public async findManyByUserAndSeen(userId: string, seen: boolean, limit: number, page: number, populate?: string) {
        try {
            const userNotifications = await this.Model.find({
                user: userId,
                seen: seen
            })
                .limit(limit)
                .skip((page - 1) * limit)
                .populate(populate);

            return Result.ok(userNotifications);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async updateManySeenByIds(userNotificationIds: string[], seen: boolean) {
        try {
            await this.Model.updateMany({
                _id: {$in: userNotificationIds}
            }, {
                $set: {
                    seen: seen
                }    
            });

            return Result.ok(true);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}