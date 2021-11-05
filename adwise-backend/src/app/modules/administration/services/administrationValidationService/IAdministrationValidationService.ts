import { Result } from "../../../../core/models/Result";

export interface IAdministrationValidationService {
    findData<T>(data: T): Result<string | null, string | null>;
    addDocumentData<T>(data: T): Result<string | null, string | null>;
    updateGlobalData<T>(data: T): Result<string | null, string | null>;
    addTaskData<T>(data: T): Result<string | null, string | null>;
    createGlobalShopData<T>(data: T): Result<string | null, string | null>;
    setUserAdminGuestData<T>(data: T): Result<string | null, string | null>;
};