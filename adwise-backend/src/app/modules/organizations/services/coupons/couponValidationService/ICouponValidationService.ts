import { Result } from "../../../../../core/models/Result";

export interface ICouponValidationService {
    createCouponData<T>(data: T): Result<string | null, string | null>;
    findCouponsData<T>(data: T): Result<string | null, string | null>;
    getUserCouponsData<T>(data: T): Result<string | null, string | null>;
    setCouponCategoriesData<T>(data: T): Result<string | null, string | null>;
};