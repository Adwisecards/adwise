import { Result } from "../../../../../core/models/Result";

export interface IAccumulationValidationService {
    createAccumulationData<T>(data: T): Result<string | null, string | null>;
};