import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { INotificationSettings } from "../../models/NotificationSettings";

export interface INotificationSettingsRepo extends IRepo<INotificationSettings> {
    findByUser(userId: string): RepoResult<INotificationSettings>;
};