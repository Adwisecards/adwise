import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IOrganizationNotification } from "../../models/OrganizationNotification";

export interface IOrganizationNotificationRepo extends IRepo<IOrganizationNotification> {
    findManyByOrganizationAndSeen(organizationId: string, seen: boolean, limit: number, page: number, populate: string): RepoResult<IOrganizationNotification[]>;
    updateManySeenByIds(ids: string[], seen: boolean): RepoResult<boolean>;
};