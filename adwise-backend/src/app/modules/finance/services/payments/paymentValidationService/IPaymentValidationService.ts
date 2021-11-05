import { Result } from "../../../../../core/models/Result";

export interface IPaymentValidationService {
    createPaymentData<T>(data: T): Result<string | null, string | null>;
    //createCashPaymentData<T>(data: T): Result<string | null, string | null>;
};