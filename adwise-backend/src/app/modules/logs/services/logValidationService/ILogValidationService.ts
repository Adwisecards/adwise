import { Result } from "../../../../core/models/Result";

export interface ILogValidationService {
    createLogData<T>(data: T): Result<string | null, string | null>;
};