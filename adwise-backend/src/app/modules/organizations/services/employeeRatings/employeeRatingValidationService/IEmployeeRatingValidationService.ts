import { Result } from "../../../../../core/models/Result";

export interface IEmployeeRatingValidationService {
    createEmployeeRatingData<T>(data: T): Result<string | null, string | null>;
    getEmployeeRatingData<T>(data: T): Result<string | null, string | null>;
    getEmployeeRatingsData<T>(data: T): Result<string | null, string | null>;
};