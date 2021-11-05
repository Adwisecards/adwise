import { Result } from "../../../../../core/models/Result";

export interface ILegalInfoRequestValidationService {
    createLegalInfoRequestData<T>(data: T): Result<string | null, string | null>;
    rejectLegalInfoRequestData<T>(data: T): Result<string | null, string | null>;
};