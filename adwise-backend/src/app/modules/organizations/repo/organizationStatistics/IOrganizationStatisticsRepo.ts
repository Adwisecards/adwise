import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IOrganizationStatistics } from "../../models/OrganizationStatistics";

export interface IOrganizationStatisticsRepo extends IRepo<IOrganizationStatistics> {
    findByOrganization(organizationId: string): RepoResult<IOrganizationStatistics>;
};