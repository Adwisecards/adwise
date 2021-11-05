import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { INotificationSettings, INotificationSettingsModel } from "../../../models/NotificationSettings";
import { INotificationSettingsRepo } from "../INoitificationSettingsRepo";

export class NotificationSettingsRepo extends Repo<INotificationSettings, INotificationSettingsModel> implements INotificationSettingsRepo {
    public async findByUser(userId: string) {
        try {
            const notificationSettings = await this.Model.findOne({user: userId});

            if (!notificationSettings) {
                return Result.fail(new RepoError('Notification settings do not exist', 404));
            }

            return Result.ok(notificationSettings);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}