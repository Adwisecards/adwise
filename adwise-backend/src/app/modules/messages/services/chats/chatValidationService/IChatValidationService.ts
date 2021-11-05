import { Result } from "../../../../../core/models/Result";

export interface IChatValidationService {
    createChatData<T>(data: T): Result<string | null, string |  null>;
};