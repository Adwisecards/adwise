import { Result } from "../../../../core/models/Result";

export interface IContactValidationService {
    createContactData<T>(data: T): Result<string | null, string | null>;
    updateContactData<T>(data: T): Result<string | null, string | null>;
    findContactsData<T>(data: T): Result<string | null, string | null>;
};