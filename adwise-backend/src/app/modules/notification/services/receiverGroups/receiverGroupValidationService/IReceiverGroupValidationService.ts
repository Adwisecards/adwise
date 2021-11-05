import { Result } from "../../../../../core/models/Result";

export interface IReceiverGroupValidationService {
    createReceiverGroupData<T>(data: T): Result<string | null, string | null>;
};