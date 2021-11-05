import { Result } from "../../../../../core/models/Result";

export interface ITipsValidationService {
    sendTipsData<T>(data: T): Result<string | null, string | null>;
    getCashierTipsData<T>(data: T): Result<string | null, string | null>;
};