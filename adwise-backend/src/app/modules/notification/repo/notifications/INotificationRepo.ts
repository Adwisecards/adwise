import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { INotification } from "../../models/Notification";

export interface INotificationRepo extends IRepo<INotification> {
    searchManyByOrganization(organizationId: string, search: string, limit: number, page: number, populate?: string): RepoResult<INotification[]>;
    countManyByOrganization(organizationId: string, search: string): RepoResult<number>;
};