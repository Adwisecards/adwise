import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IUserFinancialStatistics, IUserFinancialStatisticsModel } from "../../../models/UserFinancialStatistics";
import { IUserFinancialStatisticsRepo } from "../IUserFinancialStatisticsRepo";

export class UserFinancialStatisticsRepo extends Repo<IUserFinancialStatistics, IUserFinancialStatisticsModel> implements IUserFinancialStatisticsRepo {
    public async findByUser(userId: string) {
        try {
            const userFinancialStatistics = await this.Model.findOne({user: userId});
            if (!userFinancialStatistics) {
                return Result.fail(new RepoError('User financial statistics does not exist', 404));
            }

            return Result.ok(userFinancialStatistics);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}