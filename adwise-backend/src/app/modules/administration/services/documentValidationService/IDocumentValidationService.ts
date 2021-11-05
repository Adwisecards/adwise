import { Result } from "../../../../core/models/Result";

export interface IDocumentValidationService {
    createDocumentData<T>(data: T): Result<string | null, string | null>;
    deleteDocumentData<T>(data: T): Result<string | null, string | null>;
    updateDocumentData<T>(data: T): Result<string | null, string | null>;
    getDocumentsByTypeData<T>(data: T): Result<string | null, string | null>;
};