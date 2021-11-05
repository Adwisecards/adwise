import { Result } from "../../../../core/models/Result";

export interface IVersionValidationService {
    createVersionData<T>(data: T): Result<string | null, string | null>;
    updateVersionData<T>(data: T): Result<string | null, string | null>;
};