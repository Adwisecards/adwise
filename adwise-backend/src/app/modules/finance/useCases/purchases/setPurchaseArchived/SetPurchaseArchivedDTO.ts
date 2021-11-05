import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetPurchaseArchivedDTO {
    export interface Request {
        purchaseId: string;
        archived: boolean;
        userId: string;
    };

    export interface ResponseData {
        purchaseId: string;
        
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};