import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IOrganizationNotification, IOrganizationNotificationModel } from "../../../models/OrganizationNotification";
import { IOrganizationNotificationRepo } from "../IOrganizationNotificationRepo";

export class OrganizationNotificationRepo extends Repo<IOrganizationNotification, IOrganizationNotificationModel> implements IOrganizationNotificationRepo {
    public async findManyByOrganizationAndSeen(organizationId: string, seen: boolean, limit: number, page: number, populate: string) {
        try {
            const organizationNotifications = await this.Model.find({
                organization: organizationId,
                seen: seen
            }).sort({timestamp: -1}).limit(limit).skip((page - 1) * limit).populate(populate);

            return Result.ok(organizationNotifications);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async updateManySeenByIds(ids: string[], seen: boolean) {
        try {
            await this.Model.updateMany({_id: {$in: ids}}, {
                $set: {seen: seen}
            });

            return Result.ok(true);
        } catch (ex) {
            console.log(ex);
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}