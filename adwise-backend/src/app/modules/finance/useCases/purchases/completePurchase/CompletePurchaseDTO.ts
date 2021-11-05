import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CompletePurchaseDTO {
    export interface Request {
        purchaseId: string;
        cashierContactId: string;
    };

    export interface ResponseData {
        purchaseId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};