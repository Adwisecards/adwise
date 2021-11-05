import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace AddReviewToPurchaseDTO {
    export interface Request {
        purchaseId: string;
        review: string;
        rating: number
    };
    
    export interface ResponseData {
        purchaseId: string;
    };
    
    export type Response = Result<ResponseData | null, UseCaseError | null>;
};