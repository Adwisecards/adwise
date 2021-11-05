import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IClient } from "../../models/Client";

export interface IClientRepo extends IRepo<IClient> {
    findByOrganizationAndUser(organizationId: string, userId: string): RepoResult<IClient>;
    findByOrganization(organizationId: string, limit: number, page: number, sortBy?: string, order?: number): RepoResult<IClient[]>;
    deleteByOrganizationAndUser(organizationId: string, userId: string): RepoResult<any>;
    searchByOrganization(organizationId: string, search: string, limit: number, page: number, sortBy?: string, order?: number): RepoResult<IClient[]>;
    countByOrganization(organizationId: string, search: string): RepoResult<number>;
};