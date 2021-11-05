import { Result } from "../../../../../core/models/Result";

export interface IUserDocumentValidationService {
    generateUserDocumentData<T>(data: T): Result<string | null, string | null>;
    getUserDocumentsData<T>(data: T): Result<string | null, string | null>;
};