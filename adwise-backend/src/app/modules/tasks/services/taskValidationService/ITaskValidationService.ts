import { Result } from "../../../../core/models/Result";

export interface ITaskValidationService {
    createTaskData<T>(data: T): Result<string | null, string | null>;
};