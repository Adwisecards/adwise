import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DisableTransactionsWithContextDTO {
    export interface Request {
        context: string;
    };

    export interface ResponseData {
        transactionIds: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};