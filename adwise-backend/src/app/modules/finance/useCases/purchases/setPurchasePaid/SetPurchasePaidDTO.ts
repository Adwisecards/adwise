import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetPurchasePaidDTO {
    export interface Request {
        purchaseId: string;
    };

    export interface ResponseData {
        purchaseId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};