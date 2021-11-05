import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UnfreezeTransactionsDTO {
    export interface Request {
        
    };

    export interface ResponseData {
        transactionIds: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};