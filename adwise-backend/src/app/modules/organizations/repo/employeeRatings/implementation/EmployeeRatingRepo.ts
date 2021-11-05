import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IEmployeeRating, IEmployeeRatingModel } from "../../../models/EmployeeRating";
import { IEmployeeRatingRepo } from "../IEmployeeRatingRepo";

export class EmployeeRatingRepo extends Repo<IEmployeeRating, IEmployeeRatingModel> implements IEmployeeRatingRepo {
    public async findManyByEmployee(employeeId: string, limit?: number, page?: number, populate?: string) {
        try {
            limit = limit || 99999;
            const skip = page ? (page - 1) * limit : 0;
            populate = populate || '';

            const employeeRatings = await this.Model
                .find({employee: employeeId})
                .limit(limit)
                .skip(skip)
                .sort({_id: -1})
                .populate(populate);

            return Result.ok(employeeRatings);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}