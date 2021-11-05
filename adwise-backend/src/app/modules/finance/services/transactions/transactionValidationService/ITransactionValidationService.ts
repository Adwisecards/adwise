import { Result } from "../../../../../core/models/Result";

export interface ITransactionValidationService {
    addCommentToTransactionData<T>(data: T): Result<string | null, string | null>;
};