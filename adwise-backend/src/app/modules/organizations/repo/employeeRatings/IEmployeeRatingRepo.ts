import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IEmployeeRating } from "../../models/EmployeeRating";

export interface IEmployeeRatingRepo extends IRepo<IEmployeeRating> {
    findManyByEmployee(employeeId: string, limit?: number, page?: number, populate?: string): RepoResult<IEmployeeRating[]>;
};