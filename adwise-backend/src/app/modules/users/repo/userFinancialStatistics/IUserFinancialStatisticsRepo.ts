import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IUserFinancialStatistics } from "../../models/UserFinancialStatistics";

export interface IUserFinancialStatisticsRepo extends IRepo<IUserFinancialStatistics> {
    findByUser(userId: string): RepoResult<IUserFinancialStatistics>;
};