import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IOrganization } from "../../models/Organization";

export interface IOrganizationRepo extends IRepo<IOrganization> {
    findOrganizations(search: string, city: string, categoryIds: string[], limit: number, page: number): RepoResult<IOrganization[]>;
    findByCategory(category: string): RepoResult<IOrganization[]>;
    findByManager(managerId: string): RepoResult<IOrganization[]>;
    findByUser(userId: string): RepoResult<IOrganization>;
    findByWallet(walletId: string): RepoResult<IOrganization>;
    findByInn(inn: string): RepoResult<IOrganization>;
    searchByIds(ids: string[], search: string, categoryIds: string[], sortBy: string, order: number, limit: number, page: number): RepoResult<IOrganization[]>;
    countByIds(ids: string[], search: string, categoryIds: string[]): RepoResult<number>;
};