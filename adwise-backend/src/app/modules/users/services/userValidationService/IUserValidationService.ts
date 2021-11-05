import { Result } from "../../../../core/models/Result";

export interface IUserValidationService {
    signUpData<T>(data: T): Result<string | null, string | null>;
    signInData<T>(data: T): Result<string | null, string | null>;
    updateData<T>(data: T): Result<string | null, string | null>;
    restorePasswordData<T>(data: T): Result<string | null, string | null>;
    getManagerOperationsData<T>(data: T): Result<string | null, string | null>;
    getUserTree<T>(data: T): Result<string | null, string | null>;
    setUserParentData<T>(data: T): Result<string | null, string | null>;
    getUserTreeChildrenData<T>(data: T): Result<string | null, string | null>;
    setUserCityData<T>(data: T): Result<string | null, string | null>;
    setUserLanguageData<T>(data: T): Result<string | null, string | null>;
};