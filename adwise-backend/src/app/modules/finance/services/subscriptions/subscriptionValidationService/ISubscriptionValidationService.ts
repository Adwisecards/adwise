import { Result } from "../../../../../core/models/Result";

export interface ISubscriptionValidationService {
    createSubscriptionData<T>(data: T): Result<string | null, string | null>;
    calculateRefPaymentsData<T>(data: T): Result<string | null, string | null>;
    distributeToSubscriptionsData<T>(data: T): Result<string | null, string | null>;
    changeParentData<T>(data: T): Result<string | null, string | null>;
};