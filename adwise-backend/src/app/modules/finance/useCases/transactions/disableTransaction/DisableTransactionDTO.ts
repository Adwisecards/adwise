import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DisableTransactionDTO {
    export interface Request {
        transactionId: string;
        disabled: boolean;
    };

    export interface ResponseData {
        transactionId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};