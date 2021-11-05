import { Result } from "../../../../../core/models/Result";

export interface ICouponCategoryValidationService {
    createCouponCategoryData<T>(data: T): Result<string | null, string | null>;
    getOrganizationCouponCategoriesData<T>(data: T): Result<string | null, string | null>;
    setCouponCategoryDisabledData<T>(data: T): Result<string | null, string | null>;
};