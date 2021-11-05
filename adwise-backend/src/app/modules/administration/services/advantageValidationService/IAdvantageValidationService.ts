import { Result } from "../../../../core/models/Result";

export interface IAdvantageValidationService {
    createAdvantageData<T>(data: T): Result<string | null, string | null>;
    deleteAdvantageData<T>(data: T): Result<string | null, string | null>;
    updateAdvantageData<T>(data: T): Result<string | null, string | null>;
};