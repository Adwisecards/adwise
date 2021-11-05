import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace AddCommentToPurchaseDTO {
    export interface Request {
        purchaseId: string;
        comment: string;
    };

    export interface ResponseData {
        purchaseId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};