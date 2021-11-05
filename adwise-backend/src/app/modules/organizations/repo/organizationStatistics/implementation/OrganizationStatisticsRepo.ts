import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IOrganizationStatistics, IOrganizationStatisticsModel } from "../../../models/OrganizationStatistics";
import { IOrganizationStatisticsRepo } from "../IOrganizationStatisticsRepo";

export class OrganizationStatisticsRepo extends Repo<IOrganizationStatistics, IOrganizationStatisticsModel> implements IOrganizationStatisticsRepo {
    public async findByOrganization(organizationId: string) {
        try {
            const organizationStatistics = await this.Model.findOne({organization: organizationId});
            if (!organizationStatistics) {
                return Result.fail(new RepoError('Organization statistics does not exist', 404));
            }

            return Result.ok(organizationStatistics);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
} 