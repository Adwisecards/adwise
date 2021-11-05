import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { ISubscription } from "../../models/Subscription";

export interface ISubscriptionRepo extends IRepo<ISubscription> {
    findByUserAndOrganization(userId: string, organizationId: string): RepoResult<ISubscription>;
    findByUserAndLevel(userId: string, level: number): RepoResult<ISubscription[]>;
    findByUserAndNotLevel(userId: string, level: number): RepoResult<ISubscription[]>;
    findByUserAndOrganizationAndLevel(userId: string, organizationId: string, level: number): RepoResult<ISubscription>;
    findByRootAndOrganizationAndLevel(rootId: string, organizationId: string, level: number): RepoResult<ISubscription[]>;
    findByRootAndOrganizationAndLevelCount(rootId: string, organizationId: string, level: number): RepoResult<number>;
    findByParentIdsCount(parentId: string[]): RepoResult<number>;
    findSubscriptionsByUser(userId: string): RepoResult<ISubscription[]>;
    findByOrganizationAndLevel(organizationId: string, level: number): RepoResult<ISubscription[]>;
    findByParentsAndOrganization(parentIds: string[], organizationId: string): RepoResult<ISubscription[]>;
};