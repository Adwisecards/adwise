import { Result } from "../../../../../core/models/Result";

export interface IFavoriteOrganizationListValidationService {
    addOrganizationToUserFavoriteListData<T>(data: T): Result<string | null, string | null>;
    removeOrganizationFromUserFavoriteListData<T>(data: T): Result<string | null, string | null>;
    getUserFavoriteOrganizationsData<T>(data: T): Result<string | null, string | null>;
};