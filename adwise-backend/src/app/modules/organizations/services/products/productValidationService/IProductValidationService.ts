import { Result } from "../../../../../core/models/Result";

export interface IProductValidationService {
    createProductData<T>(data: T): Result<string | null, string | null>;
};