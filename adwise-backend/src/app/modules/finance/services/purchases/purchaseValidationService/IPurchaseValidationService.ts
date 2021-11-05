import { Result } from "../../../../../core/models/Result";

export interface IPurchaseValidationService {
    createPurchaseData<T>(data: T): Result<string | null, string | null>;
    createPurchaseForClientsData<T>(data: T): Result<string | null, string | null>;
    findUserPurchasesData<T>(data: T): Result<string | null, string | null>;
    addReviewToPurchaseData<T>(data: T): Result<string | null, string | null>;
    confirmPurchaseData<T>(data: T): Result<string | null, string | null>;
    calculatePurchaseMarketingData<T>(data: T): Result<string | null, string | null>;
    sharePurchaseData<T>(data: T): Result<string | null, string | null>;
    getPurchaseData<T>(data: T): Result<string | null, string | null>;
    payPurchaseData<T>(data: T): Result<string | null, string | null>;
    setPurchaseArchivedData<T>(data: T): Result<string | null, string | null>;
};