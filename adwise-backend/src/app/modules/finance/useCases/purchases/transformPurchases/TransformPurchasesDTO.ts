import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace TransformPurchasesDTO {
    export interface Request {
        
    };

    export interface ResponseData {
        purchaseIds: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};