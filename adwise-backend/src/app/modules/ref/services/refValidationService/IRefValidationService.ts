import { Result } from "../../../../core/models/Result";

export interface IRefValidationService {
    createRefData<T>(data: T): Result<string | null, string | null>;
};