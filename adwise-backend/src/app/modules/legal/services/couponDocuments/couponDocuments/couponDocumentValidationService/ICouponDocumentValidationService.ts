import { Result } from "../../../../../../core/models/Result";

export interface ICouponDocumentValidationService {
    getCouponDocumentsData<T>(data: T): Result<string | null, string | null>;
    generateCouponDocumentData<T>(data: T): Result<string | null, string | null>;
};