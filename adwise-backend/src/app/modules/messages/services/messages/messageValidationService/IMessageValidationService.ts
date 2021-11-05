import { Result } from "../../../../../core/models/Result";

export interface IMessageValidationService {
    createMessageData<T>(data: T): Result<string | null, string | null>;
};