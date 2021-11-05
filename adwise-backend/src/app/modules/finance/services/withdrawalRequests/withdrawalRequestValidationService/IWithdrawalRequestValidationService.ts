import { Result } from "../../../../../core/models/Result";

export interface IWithdrawalRequestValidationService {
    createLegalWithdrawalRequestData<T>(data: T): Result<string | null, string | null>;
    updateWithdrawalRequestData<T>(data: T): Result<string | null, string | null>;
};