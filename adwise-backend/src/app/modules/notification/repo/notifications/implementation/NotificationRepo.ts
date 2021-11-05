import { query } from "winston";
import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { INotification, INotificationModel } from "../../../models/Notification";
import { INotificationRepo } from "../INotificationRepo";

export class NotificationRepo extends Repo<INotification, INotificationModel> implements INotificationRepo {
    public async searchManyByOrganization(organizationId: string, search: string, limit: number, page: number, populate?: string) {
        try {
            let searchPattern = new RegExp(`.*${search || '.'}.*`, 'ig');

            const notifications = await this.Model.find({
                organization: organizationId
            })
                .or([
                    {title: {$regex: searchPattern}},
                    {body: {$regex: searchPattern}}   
                ])
                .limit(limit)
                .skip((page - 1) * limit)
                .populate(populate);

            return Result.ok(notifications);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async countManyByOrganization(organizationId: string, search: string) {
        try {
            let searchPattern = new RegExp(`.*${search || '.'}.*`, 'ig');

            const count = await this.Model.count({
                organization: organizationId
            })
                .or([
                    {title: {$regex: searchPattern}},
                    {body: {$regex: searchPattern}}   
                ]);

            return Result.ok(count);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}