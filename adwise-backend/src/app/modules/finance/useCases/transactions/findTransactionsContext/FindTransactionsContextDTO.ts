import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace FindTransactionsContextDTO {
    export interface Request {
        
    };

    export interface ResponseData {
        ids: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};