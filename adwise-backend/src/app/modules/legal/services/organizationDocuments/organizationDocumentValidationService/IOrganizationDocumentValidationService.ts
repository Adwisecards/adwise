import { Result } from "../../../../../core/models/Result";

export interface IOrganizationDocumentValidationService {
    generateOrganizationDocumentData<T>(data: T): Result<string | null, string | null>;
    getOrganizationDocumentsData<T>(data: T): Result<string | null, string | null>;
    getOrganizationDocumentData<T>(data: T): Result<string | null, string | null>;
};