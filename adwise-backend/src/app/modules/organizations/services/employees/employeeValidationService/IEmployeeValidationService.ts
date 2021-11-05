import { Result } from "../../../../../core/models/Result";

export interface IEmployeeValidationService {
    getEmployeeData<T>(data: T): Result<string | null, string | null>;
};